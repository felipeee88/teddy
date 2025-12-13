using FluentAssertions;
using Teddy.Application.DTOs.Auth;
using Teddy.Application.Validators;

namespace Teddy.Tests.Validators;

public class LoginRequestValidatorTests
{
    private readonly LoginRequestValidator _validator;

    public LoginRequestValidatorTests()
    {
        _validator = new LoginRequestValidator();
    }

    [Fact]
    public void Validate_WithValidName_ShouldPass()
    {
        var request = new LoginRequest("Felipe");

        var result = _validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Validate_WithEmptyName_ShouldFail(string name)
    {
        var request = new LoginRequest(name);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name" && e.ErrorMessage.Contains("obrigatório"));
    }

    [Theory]
    [InlineData("a")]
    [InlineData("ab")]
    public void Validate_WithNameLessThan3Characters_ShouldFail(string name)
    {
        var request = new LoginRequest(name);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name" && e.ErrorMessage.Contains("mínimo 3 caracteres"));
    }

    [Theory]
    [InlineData("abc")]
    [InlineData("John")]
    [InlineData("John Doe")]
    public void Validate_WithValidNames_ShouldPass(string name)
    {
        var request = new LoginRequest(name);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }
}
