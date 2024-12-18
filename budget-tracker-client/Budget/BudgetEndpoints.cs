
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.Budgets;

public static class BudgetEndpoints
{
    public static void MapBudgetEndpoints(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("", _addBudgetHandler);
        routeGroupBuilder.MapGet("{budgetId}", _getBudgetHandler);
        routeGroupBuilder.MapGet("", _getBudgetsHandler);
        routeGroupBuilder.MapPut("{budgetId}", _updateBudgetHandler);
        routeGroupBuilder.MapDelete("{budgetId}", _deleteBudgetHandler);
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

    private static async Task<IResult> _getBudgetHandler(
        int budgetId,
        IBudgetServices budgetServices
    )
    {
        var result = await budgetServices.GetBudget(budgetId);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get budget.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _getBudgetsHandler(
        IBudgetServices budgetServices
    )
    {
        var result = await budgetServices.GetBudgets();
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get budgets.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _updateBudgetHandler(
        [FromBody] UpdateBudgetDto dto,
        int budgetId,
        IBudgetServices budgetServices
    )
    {
        var result = await budgetServices.UpdateBudget(budgetId, dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to update budget.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _deleteBudgetHandler(
        int budgetId,
        IBudgetServices budgetServices
    )
    {
        var result = await budgetServices.DeleteBudget(budgetId);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to delete budget.",
                Detail = result.Error
            })
        );
    }
}