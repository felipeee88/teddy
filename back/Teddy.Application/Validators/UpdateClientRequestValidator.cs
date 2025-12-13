using FluentValidation;
using Teddy.Application.DTOs.Clients;

namespace Teddy.Application.Validators;

public class UpdateClientRequestValidator : AbstractValidator<UpdateClientRequest>
{
    public UpdateClientRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Nome é obrigatório")
            .MinimumLength(3).WithMessage("Nome deve ter no mínimo 3 caracteres");

        RuleFor(x => x.Salary)
            .GreaterThanOrEqualTo(0).WithMessage("Salário não pode ser negativo");

        RuleFor(x => x.CompanyValue)
            .GreaterThanOrEqualTo(0).WithMessage("Valor da empresa não pode ser negativo");
    }
}
