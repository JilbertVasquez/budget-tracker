
using budget_tracker_clients.Periods;
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.Periods;

public static class PeriodEndpoints
{
    public static void MapPeriodsEndpoints(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("", _getPeriodHandler);
        routeGroupBuilder.MapPost("", _createPeriodHandler);
        routeGroupBuilder.MapPut("{periodId}", _updatePeriodHandler);
    }

    private static async Task<IResult> _getPeriodHandler(
        IPeriodService periodService
    )
    {
        var result = await periodService.GetPeriod();
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get periods.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _createPeriodHandler(
        [FromBody] CreatePeriodDto dto,
        IPeriodService periodService
    )
    {
        var result = await periodService.CreatePeriod(dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to create period.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _updatePeriodHandler(
        int periodId,
        [FromBody] UpdatePeriodDto dto,
        IPeriodService periodService
    )
    {
        var result = await periodService.UpdatePeriod(periodId, dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to update period.",
                Detail = result.Error
            })
        );
    }
}