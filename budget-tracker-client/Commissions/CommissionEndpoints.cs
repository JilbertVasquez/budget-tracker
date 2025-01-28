
using budget_tracker_client.Configuration.AuthorizationPolicy;
using budget_tracker_client.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.Commissions;

public static class CommissionEndpoints
{
    public static void MapCommissionEndpoints(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("", _addCommissionHandler);
        routeGroupBuilder.MapPost("cashout", _cashOutCommissionHandler);
        routeGroupBuilder.MapGet("{commissionId}", _getCommissionHandler);
        routeGroupBuilder.MapGet("", _getCommissionsHandler);
        routeGroupBuilder.MapPut("{commissionId}", _updateCommissionHandler);
        routeGroupBuilder.MapDelete("{commissionId}", _deleteCommissionHandler);
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

    public static async Task<IResult> _cashOutCommissionHandler(
        [FromBody] CreateCommissionDto dto,
        ICommissionServices commissionServices

    )
    {
        var result = await commissionServices.CashOutCommission(dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to add cashout commission.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _getCommissionHandler(
        int commissionId,
        ICommissionServices commissionServices
    )
    {
        var result = await commissionServices.GetCommission(commissionId);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get commission.",
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

    private static async Task<IResult> _updateCommissionHandler(
        [FromBody] UpdateCommissionDto dto,
        int commissionId,
        ICommissionServices commissionServices
    )
    {
        var result = await commissionServices.UpdateCommission(commissionId, dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to update commission.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _deleteCommissionHandler(
        int commissionId,
        ICommissionServices commissionServices
    )
    {
        var result = await commissionServices.DeleteCommission(commissionId);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to delete commission.",
                Detail = result.Error
            })
        );
    }
}