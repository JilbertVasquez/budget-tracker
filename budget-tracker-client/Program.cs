using budget_tracker_client.Configuration;
using budget_tracker_client.Expenses;
using budget_tracker_client.Periods;
using budget_tracker_client.Users;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

var appSettings = builder.SetupAppSettings();
builder.Services.ConfigureAppServices();

var corsPolicyName = builder.SetupCors();

builder.SetupDataContext(appSettings);

var app = builder.Build();

app.UseCors(corsPolicyName);

app.UseHttpsRedirection();

app.MapCustomFallbackToFile();
app.MapGroup("api/users").MapUsersEndpoints();
app.MapGroup("api/periods").MapPeriodsEndpoints();
app.MapGroup("api/expenses").MapExpenseEndpoints();


app.Run();
