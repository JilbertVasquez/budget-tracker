using budget_tracker_client.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

var appSettings = builder.SetupAppSettings();
var corsPolicyName = builder.SetupCors();

builder.AddAppServices();

var app = builder.Build();

app.UseCors(corsPolicyName);

app.UseHttpsRedirection();

app.Run();
