using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AzureScriptingAPI.Core.Interfaces;
using AzureScriptingAPI.Core.Models;

namespace AzureScriptingAPI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ScriptsController : ControllerBase
{
    private readonly IScriptGenerationService _scriptGenerationService;
    private readonly IScriptRepository _scriptRepository;

    public ScriptsController(
        IScriptGenerationService scriptGenerationService,
        IScriptRepository scriptRepository)
    {
        _scriptGenerationService = scriptGenerationService;
        _scriptRepository = scriptRepository;
    }

    [HttpPost]
    public async Task<ActionResult<Script>> GenerateScript(
        [FromBody] GenerateScriptRequest request)
    {
        try
        {
            var script = await _scriptGenerationService.GenerateScriptAsync(
                request.Prompt,
                request.PreferredType);

            return Ok(script);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Script>> GetScript(Guid id)
    {
        var script = await _scriptRepository.GetByIdAsync(id);
        if (script == null)
            return NotFound();

        return Ok(script);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Script>>> GetAllScripts()
    {
        var scripts = await _scriptRepository.GetAllAsync();
        return Ok(scripts);
    }

    [HttpPost("{id}/validate")]
    public async Task<ActionResult<bool>> ValidateScript(Guid id)
    {
        var script = await _scriptRepository.GetByIdAsync(id);
        if (script == null)
            return NotFound();

        var isValid = await _scriptGenerationService.ValidateScriptAsync(script);
        return Ok(isValid);
    }

    [HttpPost("{id}/refine")]
    public async Task<ActionResult<Script>> RefineScript(
        Guid id,
        [FromBody] RefineScriptRequest request)
    {
        var script = await _scriptRepository.GetByIdAsync(id);
        if (script == null)
            return NotFound();

        var refinedScript = await _scriptGenerationService.RefineScriptAsync(
            script,
            request.Feedback);

        return Ok(refinedScript);
    }
}

public class GenerateScriptRequest
{
    public string Prompt { get; set; } = string.Empty;
    public ScriptType PreferredType { get; set; }
}

public class RefineScriptRequest
{
    public string Feedback { get; set; } = string.Empty;
} 