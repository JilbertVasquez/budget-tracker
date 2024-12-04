
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.Users;

public static class UsersEndpoints
{
    public static void MapUsersEndpoints(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("/login", _loginUserHandler);
        routeGroupBuilder.MapPost("/register", _registerUserHandler);
    }

    private static async Task<IResult> _loginUserHandler(
        [FromBody] LoginUserDto dto,
        IUsersService usersService
    )
    {
        var result = await usersService.GetUser(dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Login failed.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _registerUserHandler(
        [FromBody] RegisterUserDto dto,
        IUsersService usersService
    )
    {
        var result = await usersService.RegisterUser(dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to register user.",
                Detail = result.Error
            })
        );
    }
}