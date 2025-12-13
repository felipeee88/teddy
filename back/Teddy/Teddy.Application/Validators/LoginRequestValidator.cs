using FluentValidation;
using Teddy.Application.DTOs.Auth;

namespace Teddy.Application.Validators;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Nome do usuário é obrigatório")
            .MinimumLength(3).WithMessage("Nome do usuário deve ter no mínimo 3 caracteres");
    }
}
