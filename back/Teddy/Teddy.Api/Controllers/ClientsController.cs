using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Teddy.Application.DTOs.Clients;
using Teddy.Application.DTOs.Common;
using Teddy.Application.Interfaces.Services;

namespace Teddy.Api.Controllers;

[ApiController]
[Route("clients")]
[Authorize]
public class ClientsController : ControllerBase
{
    private readonly IClientService _clientService;
    private readonly ILogger<ClientsController> _logger;

    public ClientsController(IClientService clientService, ILogger<ClientsController> logger)
    {
        _clientService = clientService;
        _logger = logger;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ClientResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ClientResponse>> Create([FromBody] CreateClientRequest request)
    {
        _logger.LogInformation("Iniciando criação de cliente: {ClientName}", request.Name);
        
        var response = await _clientService.CreateAsync(request);
        
        _logger.LogInformation("Cliente criado com sucesso. Id: {ClientId}", response.Id);
        
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<ClientResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<PagedResult<ClientResponse>>> List(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 16)
    {
        _logger.LogInformation("Listando clientes - Página: {Page}, Tamanho: {PageSize}", page, pageSize);
        
        var response = await _clientService.ListAsync(page, pageSize);
        
        return Ok(response);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ClientResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ClientResponse>> GetById(Guid id)
    {
        _logger.LogInformation("Buscando cliente por Id: {ClientId}", id);
        
        var response = await _clientService.GetByIdAsync(id);
        
        return Ok(response);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ClientResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ClientResponse>> Update(Guid id, [FromBody] UpdateClientRequest request)
    {
        _logger.LogInformation("Atualizando cliente: {ClientId}", id);
        
        var response = await _clientService.UpdateAsync(id, request);
        
        _logger.LogInformation("Cliente atualizado com sucesso: {ClientId}", id);
        
        return Ok(response);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Delete(Guid id)
    {
        _logger.LogInformation("Excluindo cliente: {ClientId}", id);
        
        await _clientService.DeleteAsync(id);
        
        _logger.LogInformation("Cliente excluído com sucesso: {ClientId}", id);
        
        return NoContent();
    }
}
