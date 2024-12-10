
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
        [FromBody] BudgetRequestDto dto,
        int budgetId,
        IBudgetServices budgetServices
    )
    {
        var result = await budgetServices.GetBudget(dto, budgetId);
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
        [FromBody] BudgetRequestDto dto,
        IBudgetServices budgetServices
    )
    {
        var result = await budgetServices.GetBudgets(dto);
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
}