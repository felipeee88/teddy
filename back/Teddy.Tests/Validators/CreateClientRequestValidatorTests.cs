using FluentAssertions;
using Teddy.Application.DTOs.Clients;
using Teddy.Application.Validators;

namespace Teddy.Tests.Validators;

public class CreateClientRequestValidatorTests
{
    private readonly CreateClientRequestValidator _validator;

    public CreateClientRequestValidatorTests()
    {
        _validator = new CreateClientRequestValidator();
    }

    [Fact]
    public void Validate_WithValidData_ShouldPass()
    {
        var request = new CreateClientRequest("John Doe", 5000m, 100000m);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Validate_WithInvalidName_ShouldFail(string name)
    {
        var request = new CreateClientRequest(name, 5000m, 100000m);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-100)]
    public void Validate_WithInvalidSalary_ShouldFail(decimal salary)
    {
        var request = new CreateClientRequest("John Doe", salary, 100000m);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Salary" && e.ErrorMessage.Contains("negativo"));
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-1000)]
    public void Validate_WithInvalidCompanyValue_ShouldFail(decimal companyValue)
    {
        var request = new CreateClientRequest("John Doe", 5000m, companyValue);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "CompanyValue" && e.ErrorMessage.Contains("negativo"));
    }

    [Fact]
    public void Validate_WithAllInvalidFields_ShouldFailWithMultipleErrors()
    {
        var request = new CreateClientRequest("", -100m, -1000m);

        var result = _validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().HaveCountGreaterOrEqualTo(3);
    }
}
