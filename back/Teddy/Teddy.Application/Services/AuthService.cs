using FluentValidation;
using Teddy.Application.DTOs.Auth;
using Teddy.Application.Interfaces.Security;
using Teddy.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace Teddy.Application.Services;

public class AuthService : IAuthService
{
    private readonly IJwtTokenProvider _tokenProvider;
    private readonly IValidator<LoginRequest> _validator;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IJwtTokenProvider tokenProvider, 
        IValidator<LoginRequest> validator,
        ILogger<AuthService> logger)
    {
        _tokenProvider = tokenProvider;
        _validator = validator;
        _logger = logger;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
            
            _logger.LogWarning("Falha na validação de login para usuário: {UserName}", request.Name);
            throw new Domain.Exceptions.ValidationException(errors);
        }

        try
        {
            var name = request.Name.Trim();
            _logger.LogInformation("Gerando token de autenticação para usuário: {UserName}", name);
            
            var token = _tokenProvider.GenerateToken(name);
            var expiresIn = _tokenProvider.GetExpirationInSeconds();
            
            return new LoginResponse(token, name, expiresIn);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar token de autenticação para usuário: {UserName}", request.Name);
            throw;
        }
    }
}
