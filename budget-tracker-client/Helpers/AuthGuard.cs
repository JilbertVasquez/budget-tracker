
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using budget_tracker_client.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace budget_tracker_client.Helpers;

public interface IAuthGuard
{
    string EncodeToken(IEnumerable<Claim> claims);
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
}