
using System.Text;
using budget_tracker_client.Configuration.AuthorizationPolicy;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

namespace budget_tracker_client.Configuration;

public static class AppAuthConfigurator
{
    public static void AddAuth(this WebApplicationBuilder builder, AppSettings appSettings)
    {
        builder.Services.AddAuthentication(options => 
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options => 
        {
            options.Authority = appSettings.Auth0Authority;
            options.Audience = appSettings.Auth0Audience;
        });

        builder.SetupAuthorization();
    }

    private static void SetupAuthorization(this WebApplicationBuilder builder)
    {
        _addPolicyAndRegisterDI<IsSuperUserRequirement, IsSuperUser>(builder);
        _addPolicyAndRegisterDI<IsCommissionerRequirement, IsCommissioner>(builder);
        _addPolicyAndRegisterDI<IsExpenseTrackerRequirement, IsExpenseTracker>(builder);
        _addPolicyAndRegisterDI<IsSaverRequirement, IsSaver>(builder);
    }

    private  static void _addPolicyAndRegisterDI<TRequirement, THandler>(WebApplicationBuilder builder)
        where TRequirement : IAuthorizationRequirement, new()
        where THandler : class, IAuthorizationHandler
    {
        builder.Services.AddAuthorizationBuilder()
            .AddPolicy(typeof(THandler).Name, policy => policy.Requirements.Add(new TRequirement()));

        builder.Services.AddScoped<IAuthorizationHandler, THandler>();
    }
}