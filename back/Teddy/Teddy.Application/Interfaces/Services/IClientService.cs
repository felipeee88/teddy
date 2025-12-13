using Teddy.Application.DTOs.Clients;
using Teddy.Application.DTOs.Common;

namespace Teddy.Application.Interfaces.Services;

public interface IClientService
{
    Task<ClientResponse> CreateAsync(CreateClientRequest request);
    Task<PagedResult<ClientResponse>> ListAsync(int page, int pageSize);
    Task<ClientResponse> GetByIdAsync(Guid id);
    Task<ClientResponse> UpdateAsync(Guid id, UpdateClientRequest request);
    Task DeleteAsync(Guid id);
}
