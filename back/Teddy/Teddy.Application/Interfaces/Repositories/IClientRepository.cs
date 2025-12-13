using Teddy.Domain.Entities;

namespace Teddy.Application.Interfaces.Repositories;

public interface IClientRepository
{
    Task AddAsync(Client client);
    Task<Client?> GetByIdAsync(Guid id);
    Task<(IEnumerable<Client> Items, int TotalCount)> ListAsync(int page, int pageSize);
    Task UpdateAsync(Client client);
    Task SoftDeleteAsync(Client client);
    Task<int> SaveChangesAsync();
}
