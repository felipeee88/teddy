using Teddy.Domain.Abstractions;

namespace Teddy.Domain.Entities;

public class Client : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public decimal Salary { get; set; }
    public decimal CompanyValue { get; set; }
    public int AccessCount { get; set; }

    public Client()
    {
        AccessCount = 0;
    }

    public void IncrementAccessCount()
    {
        AccessCount++;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SoftDelete()
    {
        DeletedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}
