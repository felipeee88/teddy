using FluentAssertions;
using FluentValidation;
using Microsoft.Extensions.Logging;
using Moq;
using Teddy.Application.DTOs.Clients;
using Teddy.Application.Interfaces.Repositories;
using Teddy.Application.Services;
using Teddy.Domain.Entities;
using Teddy.Domain.Exceptions;

namespace Teddy.Tests.Application;

public class ClientServiceTests
{
    private readonly Mock<IClientRepository> _repositoryMock;
    private readonly Mock<IValidator<CreateClientRequest>> _createValidatorMock;
    private readonly Mock<IValidator<UpdateClientRequest>> _updateValidatorMock;
    private readonly Mock<ILogger<ClientService>> _loggerMock;
    private readonly ClientService _clientService;

    public ClientServiceTests()
    {
        _repositoryMock = new Mock<IClientRepository>();
        _createValidatorMock = new Mock<IValidator<CreateClientRequest>>();
        _updateValidatorMock = new Mock<IValidator<UpdateClientRequest>>();
        _loggerMock = new Mock<ILogger<ClientService>>();

        _clientService = new ClientService(
            _repositoryMock.Object,
            _createValidatorMock.Object,
            _updateValidatorMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task CreateAsync_WithValidData_ShouldCreateClient()
    {
        var request = new CreateClientRequest("John Doe", 5000m, 100000m);
        _createValidatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(new FluentValidation.Results.ValidationResult());
        _repositoryMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        var result = await _clientService.CreateAsync(request);

        result.Should().NotBeNull();
        result.Name.Should().Be("John Doe");
        result.Salary.Should().Be(5000m);
        result.CompanyValue.Should().Be(100000m);
        result.AccessCount.Should().Be(0);
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Client>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WithInvalidSalary_ShouldThrowValidationException()
    {
        var request = new CreateClientRequest("John Doe", -100m, 100000m);
        var validationFailures = new List<FluentValidation.Results.ValidationFailure>
        {
            new FluentValidation.Results.ValidationFailure("Salary", "Salary must be greater than 0")
        };
        var validationResult = new FluentValidation.Results.ValidationResult(validationFailures);
        
        _createValidatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(validationResult);

        Func<Task> act = async () => await _clientService.CreateAsync(request);

        await act.Should().ThrowAsync<Teddy.Domain.Exceptions.ValidationException>();
    }

    [Fact]
    public async Task GetByIdAsync_ExistingClient_ShouldIncrementAccessCount()
    {
        var clientId = Guid.NewGuid();
        var client = new Client
        {
            Id = clientId,
            Name = "John Doe",
            Salary = 5000m,
            CompanyValue = 100000m,
            AccessCount = 0
        };

        _repositoryMock.Setup(r => r.GetByIdAsync(clientId)).ReturnsAsync(client);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        var result = await _clientService.GetByIdAsync(clientId);

        result.Should().NotBeNull();
        result.AccessCount.Should().Be(1);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Client>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingClient_ShouldThrowNotFoundException()
    {
        var clientId = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(clientId)).ReturnsAsync((Client?)null);

        Func<Task> act = async () => await _clientService.GetByIdAsync(clientId);

        await act.Should().ThrowAsync<NotFoundException>()
            .WithMessage("Cliente não encontrado");
    }

    [Fact]
    public async Task ListAsync_ShouldReturnPagedResult()
    {
        var clients = new List<Client>
        {
            new Client { Id = Guid.NewGuid(), Name = "Client 1", Salary = 5000m, CompanyValue = 100000m },
            new Client { Id = Guid.NewGuid(), Name = "Client 2", Salary = 6000m, CompanyValue = 200000m }
        };

        _repositoryMock.Setup(r => r.ListAsync(1, 16))
            .ReturnsAsync((clients, 2));

        var result = await _clientService.ListAsync(1, 16);

        result.Should().NotBeNull();
        result.Items.Should().HaveCount(2);
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(16);
        result.TotalItems.Should().Be(2);
        result.TotalPages.Should().Be(1);
    }

    [Fact]
    public async Task UpdateAsync_ExistingClient_ShouldUpdateClient()
    {
        var clientId = Guid.NewGuid();
        var client = new Client
        {
            Id = clientId,
            Name = "Old Name",
            Salary = 5000m,
            CompanyValue = 100000m
        };

        var request = new UpdateClientRequest("New Name", 6000m, 150000m);
        
        _updateValidatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(new FluentValidation.Results.ValidationResult());
        _repositoryMock.Setup(r => r.GetByIdAsync(clientId)).ReturnsAsync(client);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        var result = await _clientService.UpdateAsync(clientId, request);

        result.Should().NotBeNull();
        result.Name.Should().Be("New Name");
        result.Salary.Should().Be(6000m);
        result.CompanyValue.Should().Be(150000m);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Client>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_ExistingClient_ShouldSoftDeleteClient()
    {
        var clientId = Guid.NewGuid();
        var client = new Client
        {
            Id = clientId,
            Name = "John Doe",
            Salary = 5000m,
            CompanyValue = 100000m
        };

        _repositoryMock.Setup(r => r.GetByIdAsync(clientId)).ReturnsAsync(client);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        await _clientService.DeleteAsync(clientId);

        _repositoryMock.Verify(r => r.SoftDeleteAsync(It.Is<Client>(c => c.DeletedAt != null)), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingClient_ShouldThrowNotFoundException()
    {
        var clientId = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(clientId)).ReturnsAsync((Client?)null);

        Func<Task> act = async () => await _clientService.DeleteAsync(clientId);

        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task CreateAsync_ShouldSetCreatedAtAndUpdatedAt()
    {
        var request = new CreateClientRequest("Jane Doe", 7000m, 120000m);
        var beforeCreate = DateTime.UtcNow;
        
        _createValidatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(new FluentValidation.Results.ValidationResult());
        _repositoryMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        var result = await _clientService.CreateAsync(request);

        result.CreatedAt.Should().BeCloseTo(beforeCreate, TimeSpan.FromSeconds(5));
        result.UpdatedAt.Should().BeCloseTo(beforeCreate, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async Task GetByIdAsync_ShouldUpdateUpdatedAtTimestamp()
    {
        var clientId = Guid.NewGuid();
        var originalUpdatedAt = DateTime.UtcNow.AddDays(-1);
        var client = new Client
        {
            Id = clientId,
            Name = "Test Client",
            Salary = 5000m,
            CompanyValue = 100000m,
            AccessCount = 5,
            UpdatedAt = originalUpdatedAt
        };

        _repositoryMock.Setup(r => r.GetByIdAsync(clientId)).ReturnsAsync(client);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        var result = await _clientService.GetByIdAsync(clientId);

        result.UpdatedAt.Should().BeAfter(originalUpdatedAt);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateUpdatedAtTimestamp()
    {
        var clientId = Guid.NewGuid();
        var originalUpdatedAt = DateTime.UtcNow.AddDays(-1);
        var client = new Client
        {
            Id = clientId,
            Name = "Old Name",
            Salary = 5000m,
            CompanyValue = 100000m,
            UpdatedAt = originalUpdatedAt
        };

        var request = new UpdateClientRequest("Updated Name", 8000m, 180000m);
        
        _updateValidatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(new FluentValidation.Results.ValidationResult());
        _repositoryMock.Setup(r => r.GetByIdAsync(clientId)).ReturnsAsync(client);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        var result = await _clientService.UpdateAsync(clientId, request);

        result.UpdatedAt.Should().BeAfter(originalUpdatedAt);
    }

    [Fact]
    public async Task DeleteAsync_ShouldSetDeletedAtTimestamp()
    {
        var clientId = Guid.NewGuid();
        Client? capturedClient = null;
        var client = new Client
        {
            Id = clientId,
            Name = "To Be Deleted",
            Salary = 5000m,
            CompanyValue = 100000m
        };

        _repositoryMock.Setup(r => r.GetByIdAsync(clientId)).ReturnsAsync(client);
        _repositoryMock.Setup(r => r.SoftDeleteAsync(It.IsAny<Client>()))
            .Callback<Client>(c => capturedClient = c);
        _repositoryMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        await _clientService.DeleteAsync(clientId);

        capturedClient.Should().NotBeNull();
        capturedClient!.DeletedAt.Should().NotBeNull();
        capturedClient.DeletedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async Task ListAsync_WithEmptyResult_ShouldReturnEmptyPagedResult()
    {
        _repositoryMock.Setup(r => r.ListAsync(1, 16))
            .ReturnsAsync((new List<Client>(), 0));

        var result = await _clientService.ListAsync(1, 16);

        result.Should().NotBeNull();
        result.Items.Should().BeEmpty();
        result.TotalItems.Should().Be(0);
        result.TotalPages.Should().Be(0);
    }

    [Fact]
    public async Task ListAsync_ShouldCalculateTotalPagesCorrectly()
    {
        var clients = Enumerable.Range(1, 10).Select(i => new Client
        {
            Id = Guid.NewGuid(),
            Name = $"Client {i}",
            Salary = 5000m,
            CompanyValue = 100000m
        }).ToList();

        _repositoryMock.Setup(r => r.ListAsync(1, 3))
            .ReturnsAsync((clients.Take(3).ToList(), 10));

        var result = await _clientService.ListAsync(1, 3);

        result.TotalItems.Should().Be(10);
        result.TotalPages.Should().Be(4);
    }

    [Fact]
    public async Task CreateAsync_WithInvalidCompanyValue_ShouldThrowValidationException()
    {
        var request = new CreateClientRequest("Jane Doe", 5000m, -1000m);
        var validationFailures = new List<FluentValidation.Results.ValidationFailure>
        {
            new FluentValidation.Results.ValidationFailure("CompanyValue", "Company value must be greater than 0")
        };
        var validationResult = new FluentValidation.Results.ValidationResult(validationFailures);
        
        _createValidatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(validationResult);

        Func<Task> act = async () => await _clientService.CreateAsync(request);

        await act.Should().ThrowAsync<Teddy.Domain.Exceptions.ValidationException>();
    }

    [Fact]
    public async Task UpdateAsync_WithInvalidData_ShouldThrowValidationException()
    {
        var clientId = Guid.NewGuid();
        var request = new UpdateClientRequest("AB", -100m, -500m);
        var validationFailures = new List<FluentValidation.Results.ValidationFailure>
        {
            new FluentValidation.Results.ValidationFailure("Name", "Name must be at least 3 characters"),
            new FluentValidation.Results.ValidationFailure("Salary", "Salary must be greater than 0"),
            new FluentValidation.Results.ValidationFailure("CompanyValue", "Company value must be greater than 0")
        };
        var validationResult = new FluentValidation.Results.ValidationResult(validationFailures);
        
        _updateValidatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(validationResult);

        Func<Task> act = async () => await _clientService.UpdateAsync(clientId, request);

        await act.Should().ThrowAsync<Teddy.Domain.Exceptions.ValidationException>();
    }
}
