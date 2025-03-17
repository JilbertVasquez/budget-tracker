
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using budget_tracker_client.Configuration;
using budget_tracker_client.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace budget_tracker_client.Helpers;

public interface IAuthGuard
{
    string EncodeToken(IEnumerable<Claim> claims);
    Task<int> GetUserId(DataContext db);
}

public class AuthGuard : IAuthGuard
{
    private readonly IOptions<AppSettings> _appSettings;
    private readonly HttpContext _http;

    public AuthGuard (
        IOptions<AppSettings> appSettings,
        IHttpContextAccessor httpContextAccessor
    )
    {
        _appSettings = appSettings;
        _http = httpContextAccessor.HttpContext!;
    }

    public string EncodeToken(IEnumerable<Claim> claims)
    {
        Console.WriteLine("$TokenSigningKey: ", _appSettings.Value.TokenSigningKey);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.Value.TokenSigningKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            SigningCredentials = credentials,
            Expires = DateTime.UtcNow.AddHours(8).AddDays(1)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public async Task<int> GetUserId(DataContext db) {
        var userIdClaim = _http.User.FindFirst(ClaimTypes.NameIdentifier);
        // if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId)) throw new("Unable to get user id.");
        if (userIdClaim == null) throw new ("Unable to get user Id.");

        var user = await db.Users.FirstOrDefaultAsync(x => x.Auth0Id == userIdClaim.Value);

        if (user == null) throw new ("Unable to get user Id.");

        return user.UserId;
    }
}