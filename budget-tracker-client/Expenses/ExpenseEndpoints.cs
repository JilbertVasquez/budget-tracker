
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.Expenses;

public static class ExpenseEndpoints
{
    public static void MapExpenseEndpoints(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("", _addExpenseHandler);
        routeGroupBuilder.MapGet("{expenseId}", _getExpenseHandler);
        routeGroupBuilder.MapGet("", _getExpensesHandler);

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

    private static async Task<IResult> _getExpenseHandler(
        [FromBody] ExpenseRequestDto dto,
        int expenseId,
        IExpenseServices expenseServices
    )
    {
        var result = await expenseServices.GetExpense(dto.UserId, expenseId);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get expense.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _getExpensesHandler(
        [FromBody] ExpenseRequestDto dto,
        IExpenseServices expenseServices
    )
    {
        var result = await expenseServices.GetExpenses(dto.UserId);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get expenses.",
                Detail = result.Error
            })
        );
    }
}