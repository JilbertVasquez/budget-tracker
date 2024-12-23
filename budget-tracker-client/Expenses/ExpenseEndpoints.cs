
using budget_tracker_client.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.Expenses;

public static class ExpenseEndpoints
{
    public static void MapExpenseEndpoints(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("", _addExpenseHandler);
        routeGroupBuilder.MapGet("{expenseId}", _getExpenseHandler);
        routeGroupBuilder.MapGet("", _getExpensesHandler);
        routeGroupBuilder.MapPut("{expenseId}", _updateExpenseHandler);
        routeGroupBuilder.MapDelete("{expenseId}", _deleteExpenseHandler);


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
        int expenseId,
        IExpenseServices expenseServices
    )
    {
        var result = await expenseServices.GetExpense(expenseId);
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
        IExpenseServices expenseServices,
        [AsParameters] DateFilterDto dateFilterDto
    )
    {
        var result = await expenseServices.GetExpenses(dateFilterDto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get expenses.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _updateExpenseHandler(
        [FromBody] UpdateExpenseDto dto,
        int expenseId,
        IExpenseServices expenseServices
    )
    {
        var result = await expenseServices.UpdateExpense(expenseId, dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to update expense.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _deleteExpenseHandler(
        int expenseId,
        IExpenseServices expenseServices
    )
    {
        var result = await expenseServices.DeleteExpense(expenseId);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to delete expense.",
                Detail = result.Error
            })
        );
    }
}