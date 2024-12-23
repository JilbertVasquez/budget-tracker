
// using budget_tracker_client.Periods;
// using Microsoft.AspNetCore.Mvc;

// namespace budget_tracker_client.Periods;

// public static class PeriodEndpoints
// {
//     public static void MapPeriodsEndpoints(this RouteGroupBuilder routeGroupBuilder)
//     {
//         routeGroupBuilder.MapGet("{periodId}", _getPeriodHandler);
//         routeGroupBuilder.MapGet("", _getPeriodsHandler);
//         routeGroupBuilder.MapPost("", _createPeriodHandler);
//         routeGroupBuilder.MapPut("{periodId}", _updatePeriodHandler);
//         routeGroupBuilder.MapDelete("{periodId}", _deletePeriodHandler);
//     }

//     private static async Task<IResult> _getPeriodHandler(
//         int periodId,
//         IPeriodServices periodService
//     )
//     {
//         var result = await periodService.GetPeriod(periodId);
//         return result.Match(
//             Results.Ok,
//             _ => Results.Problem(new()
//             {
//                 Title = "Failed to get periods.",
//                 Detail = result.Error
//             })
//         );
//     }

//     private static async Task<IResult> _getPeriodsHandler(
//         IPeriodServices periodService
//     )
//     {
//         var result = await periodService.GetPeriods();
//         return result.Match(
//             Results.Ok,
//             _ => Results.Problem(new()
//             {
//                 Title = "Failed to get periods.",
//                 Detail = result.Error
//             })
//         );
//     }

//     private static async Task<IResult> _createPeriodHandler(
//         [FromBody] CreatePeriodDto dto,
//         IPeriodServices periodService
//     )
//     {
//         var result = await periodService.CreatePeriod(dto);
//         return result.Match(
//             Results.Ok,
//             _ => Results.Problem(new()
//             {
//                 Title = "Failed to create period.",
//                 Detail = result.Error
//             })
//         );
//     }

//     private static async Task<IResult> _updatePeriodHandler(
//         int periodId,
//         [FromBody] UpdatePeriodDto dto,
//         IPeriodServices periodService
//     )
//     {
//         var result = await periodService.UpdatePeriod(periodId, dto);
//         return result.Match(
//             Results.Ok,
//             _ => Results.Problem(new()
//             {
//                 Title = "Failed to update period.",
//                 Detail = result.Error
//             })
//         );
//     }

//     private static async Task<IResult> _deletePeriodHandler(
//        int periodId,
//        IPeriodServices periodService
//    )
//     {
//         var result = await periodService.DeletePeriod(periodId);
//         return result.Match(
//             Results.Ok,
//             _ => Results.Problem(new()
//             {
//                 Title = "Failed to delete period.",
//                 Detail = result.Error
//             })
//         );
//     }
// }