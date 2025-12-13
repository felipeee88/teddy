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
            
            throw new Domain.Exceptions.ValidationException(errors);
        }

        var client = new Client
        {
            Name = request.Name.Trim(),
            Salary = request.Salary,
            CompanyValue = request.CompanyValue
        };

        await _clientRepository.AddAsync(client);
        await _clientRepository.SaveChangesAsync();

        return MapToResponse(client);
    }

    public async Task<PagedResult<ClientResponse>> ListAsync(int page, int pageSize)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 16;

        var (items, totalCount) = await _clientRepository.ListAsync(page, pageSize);
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        var clientResponses = items.Select(MapToResponse);

        return new PagedResult<ClientResponse>(clientResponses, page, pageSize, totalCount, totalPages);
    }

    public async Task<ClientResponse> GetByIdAsync(Guid id)
    {
        var client = await _clientRepository.GetByIdAsync(id);
        if (client == null)
        {
            throw new NotFoundException("Client not found");
        }

        client.IncrementAccessCount();
        await _clientRepository.UpdateAsync(client);
        await _clientRepository.SaveChangesAsync();

        return MapToResponse(client);
    }

    public async Task<ClientResponse> UpdateAsync(Guid id, UpdateClientRequest request)
    {
        var validationResult = await _updateValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
            
            throw new Domain.Exceptions.ValidationException(errors);
        }

        var client = await _clientRepository.GetByIdAsync(id);
        if (client == null)
        {
            throw new NotFoundException("Client not found");
        }

        client.Name = request.Name.Trim();
        client.Salary = request.Salary;
        client.CompanyValue = request.CompanyValue;
        client.UpdatedAt = DateTime.UtcNow;

        await _clientRepository.UpdateAsync(client);
        await _clientRepository.SaveChangesAsync();

        return MapToResponse(client);
    }

    public async Task DeleteAsync(Guid id)
    {
        var client = await _clientRepository.GetByIdAsync(id);
        if (client == null)
        {
            throw new NotFoundException("Client not found");
        }

        client.SoftDelete();
        await _clientRepository.SoftDeleteAsync(client);
        await _clientRepository.SaveChangesAsync();
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
