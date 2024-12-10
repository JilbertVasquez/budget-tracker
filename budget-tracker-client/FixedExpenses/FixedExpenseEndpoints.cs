
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.FixedExpenses;

public static class FixedExpenseEndpoints
{
    public static void MapFixedExpenseEndpoints(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("", _addFixedExpenseHandler);
        routeGroupBuilder.MapGet("{fixedExpenseId}", _getFixedExpenseHandler);
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
}