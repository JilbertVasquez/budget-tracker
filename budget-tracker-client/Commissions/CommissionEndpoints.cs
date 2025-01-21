
using budget_tracker_client.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.Commissions;

public static class CommissionEndpoints
{
    public static void MapCommissionEndpoints(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("", _addCommissionHandler);
        routeGroupBuilder.MapGet("", _getCommissionsHandler);


    }

    private static async Task<IResult> _addCommissionHandler(
        [FromBody] CreateCommissionDto dto,
        ICommissionServices commissionServices
    )
    {
        var result = await commissionServices.AddCommission(dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to add commission.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _getCommissionsHandler(
        ICommissionServices commissionServices,
        [AsParameters] DateFilterDto dateFilterDto
    )
    {
        var result = await commissionServices.GetCommissions(dateFilterDto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get commissions.",
                Detail = result.Error
            })
        );
    }
}