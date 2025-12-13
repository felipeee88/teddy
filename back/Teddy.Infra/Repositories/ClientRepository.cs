using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Teddy.Application.Interfaces.Repositories;
using Teddy.Domain.Entities;
using Teddy.Infra.Persistence;

namespace Teddy.Infra.Repositories;

public class ClientRepository : IClientRepository
{
    private readonly TeddyDbContext _context;
    private readonly ILogger<ClientRepository> _logger;

    public ClientRepository(TeddyDbContext context, ILogger<ClientRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task AddAsync(Client client)
    {
        try
        {
            await _context.Clients.AddAsync(client);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao adicionar cliente no contexto. Id: {ClientId}", client.Id);
            throw;
        }
    }

    public async Task<Client?> GetByIdAsync(Guid id)
    {
        try
        {
            return await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar cliente no banco de dados. Id: {ClientId}", id);
            throw;
        }
    }

    public async Task<(IEnumerable<Client> Items, int TotalCount)> ListAsync(int page, int pageSize)
    {
        try
        {
            var query = _context.Clients.AsQueryable();

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar clientes no banco de dados. Página: {Page}, Tamanho: {PageSize}", 
                page, pageSize);
            throw;
        }
    }

    public Task UpdateAsync(Client client)
    {
        try
        {
            _context.Clients.Update(client);
            return Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar cliente no contexto. Id: {ClientId}", client.Id);
            throw;
        }
    }

    public Task SoftDeleteAsync(Client client)
    {
        try
        {
            _context.Clients.Update(client);
            return Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao realizar soft delete do cliente no contexto. Id: {ClientId}", client.Id);
            throw;
        }
    }

    public async Task<int> SaveChangesAsync()
    {
        try
        {
            return await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao salvar alterações no banco de dados");
            throw;
        }
    }
}
