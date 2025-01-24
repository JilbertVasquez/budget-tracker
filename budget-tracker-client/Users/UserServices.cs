
using System.Security.Claims;
using budget_tracker_client.Helpers;
using budget_tracker_client.Models;
using budget_tracker_client.Shared;
using Microsoft.EntityFrameworkCore;
using budget_tracker_client.Dictionary;

namespace budget_tracker_client.Users;

public interface IUsersServices
{
    Task<Result<string, string>> LoginUser(LoginUserDto dto);
    Task<Result<bool, string>> RegisterUser(RegisterUserDto dto);
    Task<Result<bool, string>> CheckAndSaveUser(Auth0UserDto dto);
    Task<Result<UserDetailsDto, string>> GetUser(int userId);
    Task<Result<UserDetailsDto[], string>> GetUsers();
    Task<Result<bool, string>> UpdateUser(int userId, UpdateUserDto dto);
    Task<Result<bool, string>> DeleteUser(int userId);
}

public class UsersService(DataContext db, ILogger<UsersService> logger, IAuthGuard ag) : IUsersServices
{
    private readonly DataContext _db = db;
    private readonly IAuthGuard _ag = ag;

    public async Task<Result<string, string>> LoginUser(LoginUserDto dto)
    {
        try
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Username == dto.Username && x.IsDeleted == null);
            if (user == null) return Result<string, string>.Err("Login failed.");

            var userDto = new UserDto(user.UserId, user.Username);
            
            var claims = new List<Claim>
            {
                new(ClaimTypes.Name, user.Name),
                new(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            };

            if (user.Roles != null && user.Roles.Any())
            {
                var rolesAsString = string.Join(",", user.Roles);
                claims.Add(new Claim(ClaimTypes.Role, rolesAsString));
            }

            var token = _ag.EncodeToken(claims);
            return Result<string, string>.Ok(token);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Login failed.");
            return Result<string, string>.Err("Login failed.");
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

            // var user = new User(dto)
            // {
            //     CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow),
            //     Roles = new List<string> 
            //     {
            //         RolesDictionary.ExpenseTracker.ToString().ToLower(),
            //         RolesDictionary.Saver.ToString().ToLower()
            //     }
            // };
            // _db.Users.Add(user);     // no more registration, when user login, it checks if the auth0 id is exist, if not, save user credentials

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to register user.");
            return "Failed to register user.";
        }
    }

    public async Task<Result<bool, string>> CheckAndSaveUser(Auth0UserDto dto)
    {
        try 
        {
            var isUserExist = await _db.Users.FirstOrDefaultAsync(x => x.Auth0Id == dto.UserId);

            if (isUserExist != null) return true;

            var isSuccess = false;

            if (isUserExist == null)
            {
                var user = new User(dto)
                {
                    CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow),
                    Auth0Id = dto.UserId
                };
                _db.Users.Add(user);

                await _db.SaveChangesAsync();

                isSuccess = true;
            }

            if (isSuccess) return true;

            return "Failed to save user.";
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to save user.");
            return "Failed to save user.";
        }
    }

    public async Task<Result<UserDetailsDto, string>> GetUser(int userId)
    {
        try
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.UserId == userId && x.IsDeleted == null);
            if (user == null) return "Failed to get user";

            var userDto = new UserDetailsDto(user.UserId, user.Name, user.Username, user.Email);
            return userDto;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get user.");
            return "Failed to get user.";
        }
    }

    public async Task<Result<UserDetailsDto[], string>> GetUsers()
    {
        try
        {
            var users = await _db.Users
                .Where(x => x.IsDeleted == null)
                .Select(user => new UserDetailsDto(
                    user.UserId,
                    user.Name,
                    user.Username,
                    user.Email
                ))
                .ToListAsync();

            return users.ToArray();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get user.");
            return "Failed to get user.";
        }
    }

    public async Task<Result<bool, string>> UpdateUser(int userId, UpdateUserDto dto)
    {
        try
        {
            var user = await _db.Users.FindAsync(userId);
            if (user == null || user.IsDeleted != null) return "Failed to update user.";

            user.Name = dto.Name;
            user.Username = dto.Username;
            user.Email = dto.Email;

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to update user.");
            return "Failed to update user.";
        }
    }

    public async Task<Result<bool, string>> DeleteUser(int userId)
    {
        try
        {
            var user = await _db.Users.FindAsync(userId);
            if (user == null || user.IsDeleted != null) return "Failed to delete user.";

            user.IsDeleted = true;

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to delete user.");
            return "Failed to delete user.";
        }
    }
}

