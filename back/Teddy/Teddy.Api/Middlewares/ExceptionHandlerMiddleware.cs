using System.Net;
using System.Text.Json;
using Teddy.Domain.Exceptions;

namespace Teddy.Api.Middlewares;

public class ExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlerMiddleware> _logger;

    public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "Erro ao processar requisição: {Message}", exception.Message);

        context.Response.ContentType = "application/json";

        var (statusCode, response) = exception switch
        {
            ValidationException validationEx => (
                HttpStatusCode.BadRequest,
                new ErrorResponse
                {
                    Message = "Um ou mais erros de validação ocorreram",
                    Errors = validationEx.Errors
                }
            ),
            NotFoundException notFoundEx => (
                HttpStatusCode.NotFound,
                new ErrorResponse
                {
                    Message = notFoundEx.Message
                }
            ),
            DomainException domainEx => (
                HttpStatusCode.BadRequest,
                new ErrorResponse
                {
                    Message = domainEx.Message
                }
            ),
            _ => (
                HttpStatusCode.InternalServerError,
                new ErrorResponse
                {
                    Message = "Erro interno ao processar a solicitação. Tente novamente mais tarde."
                }
            )
        };

        context.Response.StatusCode = (int)statusCode;

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response, jsonOptions));
    }

    private class ErrorResponse
    {
        public string Message { get; set; } = string.Empty;
        public Dictionary<string, string[]>? Errors { get; set; }
    }
}
