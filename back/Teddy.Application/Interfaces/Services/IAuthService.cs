using Teddy.Application.DTOs.Auth;

namespace Teddy.Application.Interfaces.Services;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
}
