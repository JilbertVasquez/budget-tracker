
using budget_tracker_client.Expenses;
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.FixedExpenses;

public static class FixedExpenseEndpoints
{
    public static void MapFixedExpenseEndpoints(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("", _addFixedExpenseHandler);
        routeGroupBuilder.MapGet("{fixedExpenseId}", _getFixedExpenseHandler);
        routeGroupBuilder.MapGet("", _getFixedExpensesHandler);
        routeGroupBuilder.MapPut("{fixedExpenseId}", _updateFixedExpenseHandler);
        routeGroupBuilder.MapDelete("{fixedExpenseId}", _deleteFixedExpenseHandler);
        
    }

    private static async Task<IResult> _addFixedExpenseHandler(
        [FromBody] CreateFixedExpenseDto dto,
        IFixedExpenseServices fixedExpenseServices
    )
    {
        var result = await fixedExpenseServices.AddFixedExpenses(dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to add fixed expense.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _getFixedExpenseHandler(
       [FromBody] FixedExpenseRequestDto dto,
        int fixedExpenseId,
       IFixedExpenseServices fixedExpenseServices
   )
    {
        var result = await fixedExpenseServices.GetFixedExpense(dto, fixedExpenseId);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get fixed expense.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _getFixedExpensesHandler(
        [FromBody] FixedExpenseRequestDto dto,
        IFixedExpenseServices fixedExpenseServices
    )
    {
        var result = await fixedExpenseServices.GetFixedExpenses(dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get fixed expenses.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _updateFixedExpenseHandler(
        [FromBody] UpdateFixedExpenseDto dto,
        int fixedExpenseId,
        IFixedExpenseServices fixedExpenseServices
    )
    {
        var result = await fixedExpenseServices.UpdateFixedExpense(fixedExpenseId, dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to update fixed expense.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _deleteFixedExpenseHandler(
        [FromBody] FixedExpenseRequestDto dto,
        int fixedExpenseId,
        IFixedExpenseServices fixedExpenseServices
    )
    {
        var result = await fixedExpenseServices.DeleteFixedExpense(dto, fixedExpenseId);
        return result.Match(
            Results.Ok,
             _ => Results.Problem(new()
             {
                 Title = "Failed to delete fixed expense.",
                 Detail = result.Error
             })
        );
    }
}