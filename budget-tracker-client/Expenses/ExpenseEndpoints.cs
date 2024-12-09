
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.Expenses;

public static class ExpenseEndpoints
{
    public static void MapExpenseEndpoints(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("", _addExpenseHandler);
    }

    private static async Task<IResult> _addExpenseHandler(
        [FromBody] CreateExpenseDto dto,
        IExpenseServices expenseServices
    )
    {
        var result = await expenseServices.AddExpense(dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to add expense.",
                Detail = result.Error
            })
        );
    }
}