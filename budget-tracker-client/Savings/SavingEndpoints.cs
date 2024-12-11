
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.Savings;

public static class SavingEndpoints
{
    public static void MapSavingEndpoints(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("", _addSavingHandler);
        routeGroupBuilder.MapGet("{savingId}", _getSavingHandler);
        routeGroupBuilder.MapGet("", _getSavingsHandler);
        routeGroupBuilder.MapPut("{savingId}", _updateSavingHandler);
        routeGroupBuilder.MapDelete("{savingId}", _deleteSavingHandler);

    }

    public static async Task<IResult> _addSavingHandler(
        [FromBody] CreateSavingDto dto,
        ISavingServices savingServices
    )
    {
        var result = await savingServices.AddSaving(dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to add saving.",
                Detail = result.Error
            })
        );
    }

    public static async Task<IResult> _getSavingHandler(
        [FromBody] SavingRequestDto dto,
        int savingId,
        ISavingServices savingServices
    )
    {
        var result = await savingServices.GetSaving(dto, savingId);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get saving.",
                Detail = result.Error
            })
        );
    }

    public static async Task<IResult> _getSavingsHandler(
        [FromBody] SavingRequestDto dto,
        ISavingServices savingServices
    )
    {
        var result = await savingServices.GetSavings(dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get savings.",
                Detail = result.Error
            })
        );
    }

    public static async Task<IResult> _updateSavingHandler(
        [FromBody] UpdateSavingDto dto,
        int savingId,
        ISavingServices savingServices
    )
    {
        var result = await savingServices.UpdateSaving(dto, savingId);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to update saving.",
                Detail = result.Error
            })
        );
    }

    public static async Task<IResult> _deleteSavingHandler(
        [FromBody] SavingRequestDto dto,
        int savingId,
        ISavingServices savingServices
    )
    {
        var result = await savingServices.DeleteSaving(dto, savingId);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to delete saving.",
                Detail = result.Error
            })
        );
    }

}