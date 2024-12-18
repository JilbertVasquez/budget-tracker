
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
        int savingId,
        ISavingServices savingServices
    )
    {
        var result = await savingServices.GetSaving(savingId);
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
        ISavingServices savingServices
    )
    {
        var result = await savingServices.GetSavings();
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
        int savingId,
        ISavingServices savingServices
    )
    {
        var result = await savingServices.DeleteSaving(savingId);
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