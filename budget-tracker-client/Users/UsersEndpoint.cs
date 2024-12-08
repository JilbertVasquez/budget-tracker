
using Microsoft.AspNetCore.Mvc;

namespace budget_tracker_client.Users;

public static class UsersEndpoints
{
    public static void MapUsersEndpoints(this RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("/login", _loginUserHandler);
        routeGroupBuilder.MapPost("/register", _registerUserHandler);
        routeGroupBuilder.MapGet("/{userId}", _getUserHandler);
        routeGroupBuilder.MapGet("", _getUsersHandler);
        routeGroupBuilder.MapPut("{userId}", _updateUserHandler);
        routeGroupBuilder.MapDelete("{userId}", _deleteUserHandler);
    }

    private static async Task<IResult> _loginUserHandler(
        [FromBody] LoginUserDto dto,
        IUsersService usersService
    )
    {
        var result = await usersService.LoginUser(dto);
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

    private static async Task<IResult> _getUserHandler(
        int userId,
        IUsersService usersService
    )
    {
        var result = await usersService.GetUser(userId);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get user.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _getUsersHandler(
        IUsersService usersService
    )
    {
        var result = await usersService.GetUsers();
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get users.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _updateUserHandler(
        int userId,
        IUsersService usersService,
        UpdateUserDto dto
    )
    {
        var result = await usersService.UpdateUser(userId, dto);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to get users.",
                Detail = result.Error
            })
        );
    }

    private static async Task<IResult> _deleteUserHandler(
        int userId,
        IUsersService usersService
    )
    {
        var result = await usersService.DeleteUser(userId);
        return result.Match(
            Results.Ok,
            _ => Results.Problem(new()
            {
                Title = "Failed to delete user.",
                Detail = result.Error
            })
        );
    }
}