using budget_tracker_client.Budgets;
using budget_tracker_client.Configuration;
using budget_tracker_client.Expenses;
using budget_tracker_client.FixedExpenses;
using budget_tracker_client.Periods;
using budget_tracker_client.Users;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

var appSettings = builder.SetupAppSettings();
builder.Services.ConfigureAppServices();

var corsPolicyName = builder.SetupCors();

builder.SetupDataContext(appSettings);

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

app.MapCustomFallbackToFile();
app.MapGroup("api/users").MapUsersEndpoints();
app.MapGroup("api/periods").MapPeriodsEndpoints();
app.MapGroup("api/expenses").MapExpenseEndpoints();
app.MapGroup("api/fixedExpenses").MapFixedExpenseEndpoints();
app.MapGroup("api/budgets").MapBudgetEndpoints();

app.Run();
