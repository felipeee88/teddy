namespace Teddy.Application.DTOs.Auth;

public record LoginResponse(string Token, string UserName, int ExpiresIn);
