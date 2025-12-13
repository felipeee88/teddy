using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Teddy.Domain.Entities;
using Teddy.Infra.Persistence;
using Teddy.Infra.Repositories;

namespace Teddy.Tests.Integration;

public class ClientRepositoryTests : IDisposable
{
    private readonly TeddyDbContext _context;
    private readonly Mock<ILogger<ClientRepository>> _loggerMock;
    private readonly ClientRepository _repository;

    public ClientRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<TeddyDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new TeddyDbContext(options);
        _loggerMock = new Mock<ILogger<ClientRepository>>();
        _repository = new ClientRepository(_context, _loggerMock.Object);
    }

    [Fact]
    public async Task AddAsync_ShouldAddClientToDatabase()
    {
        var client = new Client
        {
            Id = Guid.NewGuid(),
            Name = "Test Client",
            Salary = 5000m,
            CompanyValue = 100000m,
            AccessCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(client);
        await _repository.SaveChangesAsync();

        var savedClient = await _context.Clients.FindAsync(client.Id);
        savedClient.Should().NotBeNull();
        savedClient!.Name.Should().Be("Test Client");
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnClient()
    {
        var client = new Client
        {
            Id = Guid.NewGuid(),
            Name = "Test Client",
            Salary = 5000m,
            CompanyValue = 100000m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.Clients.AddAsync(client);
        await _context.SaveChangesAsync();

        var result = await _repository.GetByIdAsync(client.Id);

        result.Should().NotBeNull();
        result!.Id.Should().Be(client.Id);
        result.Name.Should().Be("Test Client");
    }

    [Fact]
    public async Task GetByIdAsync_WithNonExistingId_ShouldReturnNull()
    {
        var nonExistingId = Guid.NewGuid();

        var result = await _repository.GetByIdAsync(nonExistingId);

        result.Should().BeNull();
    }

    [Fact]
    public async Task GetByIdAsync_WithDeletedClient_ShouldReturnNull()
    {
        var client = new Client
        {
            Id = Guid.NewGuid(),
            Name = "Deleted Client",
            Salary = 5000m,
            CompanyValue = 100000m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            DeletedAt = DateTime.UtcNow
        };

        await _context.Clients.AddAsync(client);
        await _context.SaveChangesAsync();

        var result = await _repository.GetByIdAsync(client.Id);

        result.Should().BeNull();
    }

    [Fact]
    public async Task ListAsync_ShouldReturnPagedClients()
    {
        var clients = Enumerable.Range(1, 5).Select(i => new Client
        {
            Id = Guid.NewGuid(),
            Name = $"Client {i}",
            Salary = 5000m * i,
            CompanyValue = 100000m * i,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        }).ToList();

        await _context.Clients.AddRangeAsync(clients);
        await _context.SaveChangesAsync();

        var (items, total) = await _repository.ListAsync(1, 3);

        items.Should().HaveCount(3);
        total.Should().Be(5);
    }

    [Fact]
    public async Task ListAsync_ShouldNotReturnDeletedClients()
    {
        var activeClient = new Client
        {
            Id = Guid.NewGuid(),
            Name = "Active Client",
            Salary = 5000m,
            CompanyValue = 100000m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var deletedClient = new Client
        {
            Id = Guid.NewGuid(),
            Name = "Deleted Client",
            Salary = 5000m,
            CompanyValue = 100000m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            DeletedAt = DateTime.UtcNow
        };

        await _context.Clients.AddRangeAsync(activeClient, deletedClient);
        await _context.SaveChangesAsync();

        var (items, total) = await _repository.ListAsync(1, 10);

        items.Should().HaveCount(1);
        total.Should().Be(1);
        items.First().Name.Should().Be("Active Client");
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateClient()
    {
        var client = new Client
        {
            Id = Guid.NewGuid(),
            Name = "Original Name",
            Salary = 5000m,
            CompanyValue = 100000m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.Clients.AddAsync(client);
        await _context.SaveChangesAsync();

        client.Name = "Updated Name";
        client.Salary = 6000m;
        await _repository.UpdateAsync(client);
        await _repository.SaveChangesAsync();

        var updatedClient = await _context.Clients.FindAsync(client.Id);
        updatedClient!.Name.Should().Be("Updated Name");
        updatedClient.Salary.Should().Be(6000m);
    }

    [Fact]
    public async Task SoftDeleteAsync_ShouldSetDeletedAt()
    {
        var client = new Client
        {
            Id = Guid.NewGuid(),
            Name = "To Be Deleted",
            Salary = 5000m,
            CompanyValue = 100000m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.Clients.AddAsync(client);
        await _context.SaveChangesAsync();

        client.DeletedAt = DateTime.UtcNow;
        await _repository.SoftDeleteAsync(client);
        await _repository.SaveChangesAsync();

        _context.ChangeTracker.Clear();

        var deletedClient = await _context.Clients.IgnoreQueryFilters()
            .FirstOrDefaultAsync(c => c.Id == client.Id);

        deletedClient.Should().NotBeNull();
        deletedClient!.DeletedAt.Should().NotBeNull();
    }

    [Fact]
    public async Task SoftDeleteAsync_ClientShouldNotAppearInNormalQueries()
    {
        var client = new Client
        {
            Id = Guid.NewGuid(),
            Name = "To Be Deleted",
            Salary = 5000m,
            CompanyValue = 100000m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.Clients.AddAsync(client);
        await _context.SaveChangesAsync();

        client.DeletedAt = DateTime.UtcNow;
        await _repository.SoftDeleteAsync(client);
        await _repository.SaveChangesAsync();

        var result = await _repository.GetByIdAsync(client.Id);
        result.Should().BeNull();

        var (items, total) = await _repository.ListAsync(1, 10);
        items.Should().NotContain(c => c.Id == client.Id);
    }

    [Fact]
    public async Task ListAsync_WithMultiplePages_ShouldReturnCorrectPage()
    {
        var clients = Enumerable.Range(1, 10).Select(i => new Client
        {
            Id = Guid.NewGuid(),
            Name = $"Client {i:D2}",
            Salary = 5000m,
            CompanyValue = 100000m,
            CreatedAt = DateTime.UtcNow.AddMinutes(-i),
            UpdatedAt = DateTime.UtcNow
        }).ToList();

        await _context.Clients.AddRangeAsync(clients);
        await _context.SaveChangesAsync();

        var (page1Items, page1Total) = await _repository.ListAsync(1, 3);
        var (page2Items, page2Total) = await _repository.ListAsync(2, 3);

        page1Items.Should().HaveCount(3);
        page1Total.Should().Be(10);
        page2Items.Should().HaveCount(3);
        page2Total.Should().Be(10);

        page1Items.Should().NotIntersectWith(page2Items);
    }

    [Fact]
    public async Task ListAsync_WithEmptyDatabase_ShouldReturnEmptyList()
    {
        var (items, total) = await _repository.ListAsync(1, 10);

        items.Should().BeEmpty();
        total.Should().Be(0);
    }

    [Fact]
    public async Task SaveChangesAsync_ShouldReturnNumberOfAffectedRecords()
    {
        var client = new Client
        {
            Id = Guid.NewGuid(),
            Name = "Test Client",
            Salary = 5000m,
            CompanyValue = 100000m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(client);
        var affectedRecords = await _repository.SaveChangesAsync();

        affectedRecords.Should().Be(1);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
