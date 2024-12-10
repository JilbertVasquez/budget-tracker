
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.Budgets;

public static class BudgetEndpoints
{
    public static void MapBudgetEndpoints(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("", _addBudgetHandler);
    }

    private static async Task<IResult> _addBudgetHandler(
        [FromBody] CreateBudgetDto dto,
        IBudgetServices budgetServices
    )
    {
        var result = await budgetServices.AddBudget(dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new ()
            {
                Title = "Failed to add budget.",
                Detail = result.Error
            })
        );
    }
}