using FluentAssertions;
using FluentValidation;
using Microsoft.Extensions.Logging;
using Moq;
using Teddy.Application.DTOs.Auth;
using Teddy.Application.Interfaces.Security;
using Teddy.Application.Services;
using Teddy.Domain.Exceptions;

namespace Teddy.Tests.Application;

public class AuthServiceTests
{
    private readonly Mock<IJwtTokenProvider> _jwtTokenProviderMock;
    private readonly Mock<IValidator<LoginRequest>> _validatorMock;
    private readonly Mock<ILogger<AuthService>> _loggerMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _jwtTokenProviderMock = new Mock<IJwtTokenProvider>();
        _validatorMock = new Mock<IValidator<LoginRequest>>();
        _loggerMock = new Mock<ILogger<AuthService>>();

        _jwtTokenProviderMock.Setup(j => j.GenerateToken(It.IsAny<string>()))
            .Returns("fake.jwt.token");
        _jwtTokenProviderMock.Setup(j => j.GetExpirationInSeconds())
            .Returns(3600);

        _authService = new AuthService(
            _jwtTokenProviderMock.Object, 
            _validatorMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task LoginAsync_WithValidName_ShouldReturnTokenAndUserInfo()
    {
        var request = new LoginRequest("Felipe");
        _validatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(new FluentValidation.Results.ValidationResult());

        var result = await _authService.LoginAsync(request);

        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();
        result.UserName.Should().Be("Felipe");
        result.ExpiresIn.Should().Be(3600);
    }

    [Fact]
    public async Task LoginAsync_WithNameLessThan3Characters_ShouldThrowValidationException()
    {
        var request = new LoginRequest("Fe");
        var validationFailures = new List<FluentValidation.Results.ValidationFailure>
        {
            new FluentValidation.Results.ValidationFailure("Name", "Name must be at least 3 characters")
        };
        var validationResult = new FluentValidation.Results.ValidationResult(validationFailures);
        
        _validatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(validationResult);

        Func<Task> act = async () => await _authService.LoginAsync(request);

        await act.Should().ThrowAsync<Teddy.Domain.Exceptions.ValidationException>()
            .WithMessage("One or more validation errors occurred.");
    }

    [Fact]
    public async Task LoginAsync_WithEmptyName_ShouldThrowValidationException()
    {
        var request = new LoginRequest("");
        var validationFailures = new List<FluentValidation.Results.ValidationFailure>
        {
            new FluentValidation.Results.ValidationFailure("Name", "Name is required")
        };
        var validationResult = new FluentValidation.Results.ValidationResult(validationFailures);
        
        _validatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(validationResult);
        
        Func<Task> act = async () => await _authService.LoginAsync(request);

        await act.Should().ThrowAsync<Teddy.Domain.Exceptions.ValidationException>();
    }

    [Fact]
    public async Task LoginAsync_WithValidName_TokenShouldNotBeEmpty()
    {
        var request = new LoginRequest("ValidUser");
        _validatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(new FluentValidation.Results.ValidationResult());

        var result = await _authService.LoginAsync(request);

        result.Token.Should().NotBeNullOrWhiteSpace();
        result.Token.Split('.').Should().HaveCount(3);
    }

    [Fact]
    public async Task LoginAsync_ShouldCallJwtTokenProviderWithCorrectName()
    {
        var request = new LoginRequest("TestUser");
        _validatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(new FluentValidation.Results.ValidationResult());

        await _authService.LoginAsync(request);

        _jwtTokenProviderMock.Verify(j => j.GenerateToken("TestUser"), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_ShouldCallValidatorBeforeGeneratingToken()
    {
        var request = new LoginRequest("ValidUser");
        var validationCalled = false;
        var tokenGenerationCalled = false;

        _validatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(() =>
            {
                validationCalled = true;
                tokenGenerationCalled.Should().BeFalse();
                return new FluentValidation.Results.ValidationResult();
            });

        _jwtTokenProviderMock.Setup(j => j.GenerateToken(It.IsAny<string>()))
            .Returns(() =>
            {
                tokenGenerationCalled = true;
                validationCalled.Should().BeTrue();
                return "fake.jwt.token";
            });

        await _authService.LoginAsync(request);

        validationCalled.Should().BeTrue();
        tokenGenerationCalled.Should().BeTrue();
    }

    [Fact]
    public async Task LoginAsync_WithNullName_ShouldThrowValidationException()
    {
        var request = new LoginRequest(null!);
        var validationFailures = new List<FluentValidation.Results.ValidationFailure>
        {
            new FluentValidation.Results.ValidationFailure("Name", "Name is required")
        };
        var validationResult = new FluentValidation.Results.ValidationResult(validationFailures);
        
        _validatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(validationResult);

        Func<Task> act = async () => await _authService.LoginAsync(request);

        await act.Should().ThrowAsync<Teddy.Domain.Exceptions.ValidationException>();
    }

    [Theory]
    [InlineData("ABC")]
    [InlineData("John")]
    [InlineData("ValidUserName")]
    public async Task LoginAsync_WithDifferentValidNames_ShouldReturnToken(string name)
    {
        var request = new LoginRequest(name);
        _validatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(new FluentValidation.Results.ValidationResult());

        var result = await _authService.LoginAsync(request);

        result.Should().NotBeNull();
        result.UserName.Should().Be(name);
        result.Token.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnConsistentExpirationTime()
    {
        var request = new LoginRequest("User");
        _validatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(new FluentValidation.Results.ValidationResult());

        var result = await _authService.LoginAsync(request);

        result.ExpiresIn.Should().Be(3600);
        _jwtTokenProviderMock.Verify(j => j.GetExpirationInSeconds(), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_WithMultipleValidationErrors_ShouldThrowValidationException()
    {
        var request = new LoginRequest("");
        var validationFailures = new List<FluentValidation.Results.ValidationFailure>
        {
            new FluentValidation.Results.ValidationFailure("Name", "Name is required"),
            new FluentValidation.Results.ValidationFailure("Name", "Name must be at least 3 characters")
        };
        var validationResult = new FluentValidation.Results.ValidationResult(validationFailures);
        
        _validatorMock.Setup(v => v.ValidateAsync(request, default))
            .ReturnsAsync(validationResult);

        Func<Task> act = async () => await _authService.LoginAsync(request);

        var exception = await act.Should().ThrowAsync<Teddy.Domain.Exceptions.ValidationException>();
        exception.Which.Errors.Should().ContainKey("Name");
        exception.Which.Errors["Name"].Should().HaveCountGreaterOrEqualTo(1);
    }
}
