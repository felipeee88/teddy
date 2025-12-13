namespace Teddy.Application.Interfaces.Security;

public interface IJwtTokenProvider
{
    string GenerateToken(string name);
    int GetExpirationInSeconds();
}
