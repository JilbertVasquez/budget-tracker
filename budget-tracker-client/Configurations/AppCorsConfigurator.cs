
using Microsoft.AspNetCore.Cors.Infrastructure;

public static class AppCorsConfigurator
{
    private const string _localCorsPolicy = "localCorsPolicy";
    private const string _productionCorsPolicy = "productionCorsPolicy";

    public static string SetupCors(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(x => x.AddPolicy(_localCorsPolicy, CorsPolicyBuilder => {
            CorsPolicyBuilder
                .WithOrigins("https:localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }));

        builder.Services.AddCors(x => x.AddPolicy(_productionCorsPolicy, CorsPolicyBuilder =>
        {
            CorsPolicyBuilder
                .WithOrigins("")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }));

        return builder.Environment.IsProduction() ? _productionCorsPolicy : _localCorsPolicy;
    }
}