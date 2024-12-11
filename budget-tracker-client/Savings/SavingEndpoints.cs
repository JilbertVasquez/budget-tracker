
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.Savings;

public static class SavingEndpoints
{
    public static void MapSavingEndpoints(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("", _addSavingHandler);
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

}