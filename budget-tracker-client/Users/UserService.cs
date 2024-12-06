
using budget_tracker_client.Models;
using budget_tracker_client.Shared;
using Microsoft.EntityFrameworkCore;

namespace budget_tracker_client.Users;

public interface IUsersService
{
    Task<Result<UserDto, string>> GetUser(LoginUserDto dto);
    Task<Result<UserDto, string>> LoginUser(LoginUserDto dto);

    Task<Result<bool, string>> RegisterUser(RegisterUserDto dto);
}

public class UsersService(DataContext db, ILogger<UsersService> logger) : IUsersService
{
    private readonly DataContext _db = db;

    public async Task<Result<UserDto, string>> GetUser(LoginUserDto dto)
    {
        try
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Username == dto.Username && x.IsDeleted == null);
            if (user == null) return "Failed to get user";

            var userDto = new UserDto(user.UserId, user.Username);
            return userDto;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get user.");
            return "Failed to get user.";
        }
    }

    public async Task<Result<UserDto, string>> LoginUser(LoginUserDto dto)
    {
        try
        {
            return await GetUser(dto);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Login failed.");
            return "Login failed.";
        }
    }

    public async Task<Result<bool, string>> RegisterUser(RegisterUserDto dto)
    {
        try
        {
            if (string.IsNullOrEmpty(dto.Name)) return "Invalid firstname.";
            if (string.IsNullOrEmpty(dto.Username) || dto.Username.Length < 3) return "Invalid username.";
            if (string.IsNullOrEmpty(dto.Password) || dto.Password.Length < 3) return "Invalid password.";
            if (string.IsNullOrEmpty(dto.Email)) return "Invalid email.";

            if (await _db.Users.AnyAsync(x => (x.Username == dto.Username || x.Email == dto.Email) && x.IsDeleted == null))
                return "Username or email is already taken.";

            var user = new User(dto)
            {
                CreatedAt = DateTime.UtcNow
            };
            _db.Users.Add(user);

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to register user.");
            return "Failed to register user.";
        }
    }
}

