using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Teddy.Application.Interfaces.Security;

namespace Teddy.Application.Security;

public class JwtTokenProvider : IJwtTokenProvider
{
    private readonly IConfiguration _configuration;

    public JwtTokenProvider(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(string name)
    {
        var secret = GetRequiredConfig("JWT:Secret");
        var issuer = GetRequiredConfig("JWT:Issuer");
        var audience = GetRequiredConfig("JWT:Audience");
        var expiresMinutes = int.Parse(_configuration["JWT:ExpiresMinutes"] ?? "60");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Name, name),
            new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public int GetExpirationInSeconds()
    {
        var expiresMinutes = int.Parse(_configuration["JWT:ExpiresMinutes"] ?? "60");
        return expiresMinutes * 60;
    }

    private string GetRequiredConfig(string key)
    {
        return _configuration[key] ?? throw new InvalidOperationException($"{key} not configured");
    }
}
