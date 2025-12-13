using System.Text;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Prometheus;
using Serilog;
using Serilog.Formatting.Compact;
using Teddy.Application.Interfaces.Repositories;
using Teddy.Application.Interfaces.Security;
using Teddy.Application.Interfaces.Services;
using Teddy.Application.Security;
using Teddy.Application.Services;
using Teddy.Application.Validators;
using Teddy.Infra.Persistence;
using Teddy.Infra.Repositories;

namespace Teddy.IoC;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<TeddyDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IClientRepository, ClientRepository>();

        services.AddScoped<IJwtTokenProvider, JwtTokenProvider>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IClientService, ClientService>();

        services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

        AddJwtAuthentication(services, configuration);

        services.AddHealthChecks()
            .AddDbContextCheck<TeddyDbContext>();

        services.AddSingleton(Metrics.DefaultRegistry);

        return services;
    }

    private static void AddJwtAuthentication(IServiceCollection services, IConfiguration configuration)
    {
        var secret = configuration["JWT:Secret"] ?? throw new InvalidOperationException("JWT:Secret not configured");
        var issuer = configuration["JWT:Issuer"] ?? throw new InvalidOperationException("JWT:Issuer not configured");
        var audience = configuration["JWT:Audience"] ?? throw new InvalidOperationException("JWT:Audience not configured");

        var key = Encoding.UTF8.GetBytes(secret);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });

        services.AddAuthorization();
    }

    public static void ConfigureSerilog(IConfiguration configuration)
    {
        Log.Logger = new LoggerConfiguration()
            .ReadFrom.Configuration(configuration)
            .Enrich.FromLogContext()
            .Enrich.WithProperty("Application", "Teddy.Api")
            .WriteTo.Console(new CompactJsonFormatter())
            .CreateLogger();
    }
}
