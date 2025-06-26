
using Microsoft.AspNetCore.Cors.Infrastructure;

public static class AppCorsConfigurator
{
    private const string _localCorsPolicy = "localCorsPolicy";
    private const string _productionCorsPolicy = "productionCorsPolicy";

    public static string SetupCors(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(x => x.AddPolicy(_localCorsPolicy, CorsPolicyBuilder => {
            CorsPolicyBuilder
                .WithOrigins("http://localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }));

        builder.Services.AddCors(x => x.AddPolicy(_productionCorsPolicy, CorsPolicyBuilder =>
        {
            CorsPolicyBuilder
                .WithOrigins("https://budgettracker.io", "http://budgettracker.io", "http://localhost:5004", "https://budget-tracker-app.victoriousplant-30209041.southeastasia.azurecontainerapps.io")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }));

        return builder.Environment.IsProduction() ? _productionCorsPolicy : _localCorsPolicy;
    }
}