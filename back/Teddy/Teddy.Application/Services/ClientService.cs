using FluentValidation;
using Teddy.Application.DTOs.Clients;
using Teddy.Application.DTOs.Common;
using Teddy.Application.Interfaces.Repositories;
using Teddy.Application.Interfaces.Services;
using Teddy.Domain.Entities;
using Teddy.Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace Teddy.Application.Services;

public class ClientService : IClientService
{
    private readonly IClientRepository _clientRepository;
    private readonly IValidator<CreateClientRequest> _createValidator;
    private readonly IValidator<UpdateClientRequest> _updateValidator;
    private readonly ILogger<ClientService> _logger;

    public ClientService(
        IClientRepository clientRepository,
        IValidator<CreateClientRequest> createValidator,
        IValidator<UpdateClientRequest> updateValidator,
        ILogger<ClientService> logger)
    {
        _clientRepository = clientRepository;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _logger = logger;
    }

    public async Task<ClientResponse> CreateAsync(CreateClientRequest request)
    {
        var validationResult = await _createValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
            
            _logger.LogWarning("Falha na validação ao criar cliente: {ClientName}", request.Name);
            throw new Domain.Exceptions.ValidationException(errors);
        }

        try
        {
            var client = new Client
            {
                Name = request.Name.Trim(),
                Salary = request.Salary,
                CompanyValue = request.CompanyValue
            };

            await _clientRepository.AddAsync(client);
            await _clientRepository.SaveChangesAsync();
            
            _logger.LogInformation("Cliente criado com sucesso. Id: {ClientId}, Nome: {ClientName}", 
                client.Id, client.Name);

            return MapToResponse(client);
        }
        catch (Exception ex) when (ex is not Domain.Exceptions.ValidationException)
        {
            _logger.LogError(ex, "Erro ao criar cliente: {ClientName}", request.Name);
            throw;
        }
    }

    public async Task<PagedResult<ClientResponse>> ListAsync(int page, int pageSize)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 16;

        try
        {
            var (items, totalCount) = await _clientRepository.ListAsync(page, pageSize);
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var clientResponses = items.Select(MapToResponse);

            _logger.LogInformation("Listagem de clientes concluída. Total: {TotalCount}, Página: {Page}", 
                totalCount, page);

            return new PagedResult<ClientResponse>(clientResponses, page, pageSize, totalCount, totalPages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar clientes. Página: {Page}, Tamanho: {PageSize}", page, pageSize);
            throw;
        }
    }

    public async Task<ClientResponse> GetByIdAsync(Guid id)
    {
        try
        {
            var client = await _clientRepository.GetByIdAsync(id);
            if (client == null)
            {
                _logger.LogWarning("Cliente não encontrado. Id: {ClientId}", id);
                throw new NotFoundException($"Cliente não encontrado");
            }

            client.IncrementAccessCount();
            await _clientRepository.UpdateAsync(client);
            await _clientRepository.SaveChangesAsync();

            _logger.LogInformation("Cliente recuperado com sucesso. Id: {ClientId}, Acessos: {AccessCount}", 
                client.Id, client.AccessCount);

            return MapToResponse(client);
        }
        catch (Exception ex) when (ex is not NotFoundException)
        {
            _logger.LogError(ex, "Erro ao buscar cliente. Id: {ClientId}", id);
            throw;
        }
    }

    public async Task<ClientResponse> UpdateAsync(Guid id, UpdateClientRequest request)
    {
        var validationResult = await _updateValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
            
            _logger.LogWarning("Falha na validação ao atualizar cliente. Id: {ClientId}", id);
            throw new Domain.Exceptions.ValidationException(errors);
        }

        try
        {
            var client = await _clientRepository.GetByIdAsync(id);
            if (client == null)
            {
                _logger.LogWarning("Cliente não encontrado para atualização. Id: {ClientId}", id);
                throw new NotFoundException($"Cliente não encontrado");
            }

            client.Name = request.Name.Trim();
            client.Salary = request.Salary;
            client.CompanyValue = request.CompanyValue;
            client.UpdatedAt = DateTime.UtcNow;

            await _clientRepository.UpdateAsync(client);
            await _clientRepository.SaveChangesAsync();

            _logger.LogInformation("Cliente atualizado com sucesso. Id: {ClientId}, Nome: {ClientName}", 
                client.Id, client.Name);

            return MapToResponse(client);
        }
        catch (Exception ex) when (ex is not NotFoundException and not Domain.Exceptions.ValidationException)
        {
            _logger.LogError(ex, "Erro ao atualizar cliente. Id: {ClientId}", id);
            throw;
        }
    }

    public async Task DeleteAsync(Guid id)
    {
        try
        {
            var client = await _clientRepository.GetByIdAsync(id);
            if (client == null)
            {
                _logger.LogWarning("Cliente não encontrado para exclusão. Id: {ClientId}", id);
                throw new NotFoundException($"Cliente não encontrado");
            }

            client.SoftDelete();
            await _clientRepository.SoftDeleteAsync(client);
            await _clientRepository.SaveChangesAsync();

            _logger.LogInformation("Cliente excluído com sucesso (soft delete). Id: {ClientId}", id);
        }
        catch (Exception ex) when (ex is not NotFoundException)
        {
            _logger.LogError(ex, "Erro ao excluir cliente. Id: {ClientId}", id);
            throw;
        }
    }

    private static ClientResponse MapToResponse(Client client)
    {
        return new ClientResponse(
            client.Id,
            client.Name,
            client.Salary,
            client.CompanyValue,
            client.AccessCount,
            client.CreatedAt,
            client.UpdatedAt
        );
    }
}
