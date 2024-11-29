namespace budget_tracker_client.Configuration;

public static class AppServiceConfigurator
{
    public static void AddAppServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddAutoMapper(typeof(Program));
    }
}