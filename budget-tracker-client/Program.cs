using budget_tracker_client.Budgets;
using budget_tracker_client.Configuration;
using budget_tracker_client.Expenses;
using budget_tracker_client.FixedExpenses;
// using budget_tracker_client.Periods;
using budget_tracker_client.Savings;
using budget_tracker_client.Users;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

var appSettings = builder.SetupAppSettings();
var corsPolicyName = builder.SetupCors();

builder.SetupDataContext(appSettings);
builder.AddAuth(appSettings);
builder.Services.AddAuthorization();

builder.Services.ConfigureAppServices();

builder.Services.AddHttpContextAccessor();

var app = builder.Build();

app.UseCors(corsPolicyName);

app.UseDefaultFiles(new DefaultFilesOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.WebRootPath, "browser"))
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.WebRootPath, "browser"))
});

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapCustomFallbackToFile();
app.MapGroup("api/users").MapUsersEndpoints();
// app.MapGroup("api/periods").RequireAuthorization().MapPeriodsEndpoints();
app.MapGroup("api/expenses").RequireAuthorization().MapExpenseEndpoints();
app.MapGroup("api/fixedExpenses").RequireAuthorization().MapFixedExpenseEndpoints();
app.MapGroup("api/budgets").RequireAuthorization().MapBudgetEndpoints();
app.MapGroup("api/savings").RequireAuthorization().MapSavingEndpoints();

app.Run();
