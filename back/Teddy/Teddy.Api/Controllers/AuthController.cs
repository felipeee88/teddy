using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Teddy.Application.DTOs.Auth;
using Teddy.Application.Interfaces.Services;

namespace Teddy.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        _logger.LogInformation("Iniciando autenticação do usuário: {UserName}", request.Name);
        
        var response = await _authService.LoginAsync(request);
        
        _logger.LogInformation("Usuário autenticado com sucesso: {UserName}", response.UserName);
        
        return Ok(response);
    }
}
