using FluentAssertions;
using Teddy.Application.DTOs.Clients;
using Teddy.Application.Validators;

namespace Teddy.Tests.Validators;

public class UpdateClientRequestValidatorTests
{
    private readonly UpdateClientRequestValidator _validator;

    public UpdateClientRequestValidatorTests()
    {
        _validator = new UpdateClientRequestValidator();
    }

    [Fact]
    public void Validate_WithValidRequest_ShouldPass()
    {
        var request = new UpdateClientRequest("John Doe", 5000.00m, 100000.00m);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Validate_WithEmptyName_ShouldFail(string name)
    {
        var request = new UpdateClientRequest(name, 5000.00m, 100000.00m);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name" && e.ErrorMessage.Contains("obrigatório"));
    }

    [Theory]
    [InlineData("a")]
    [InlineData("ab")]
    public void Validate_WithNameLessThan3Characters_ShouldFail(string name)
    {
        var request = new UpdateClientRequest(name, 5000.00m, 100000.00m);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name" && e.ErrorMessage.Contains("mínimo 3 caracteres"));
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-100.50)]
    public void Validate_WithInvalidSalary_ShouldFail(decimal salary)
    {
        var request = new UpdateClientRequest("John Doe", salary, 100000.00m);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Salary" && e.ErrorMessage.Contains("negativo"));
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-500.75)]
    public void Validate_WithInvalidCompanyValue_ShouldFail(decimal companyValue)
    {
        var request = new UpdateClientRequest("John Doe", 5000.00m, companyValue);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "CompanyValue" && e.ErrorMessage.Contains("negativo"));
    }

    [Fact]
    public void Validate_WithMultipleErrors_ShouldReturnAllErrors()
    {
        var request = new UpdateClientRequest("", -1, -1);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().HaveCountGreaterOrEqualTo(3);
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
        result.Errors.Should().Contain(e => e.PropertyName == "Salary");
        result.Errors.Should().Contain(e => e.PropertyName == "CompanyValue");
    }

    [Fact]
    public void Validate_WithMinimumValidValues_ShouldPass()
    {
        var request = new UpdateClientRequest("ABC", 0.01m, 0.01m);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }
}
