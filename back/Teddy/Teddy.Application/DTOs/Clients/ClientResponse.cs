namespace Teddy.Application.DTOs.Clients;

public record ClientResponse(
    Guid Id,
    string Name,
    decimal Salary,
    decimal CompanyValue,
    int AccessCount,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
