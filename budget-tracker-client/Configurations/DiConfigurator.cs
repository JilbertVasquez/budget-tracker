
using budget_tracker_client.Users;
using budget_tracker_client.Periods;

namespace budget_tracker_client.Configuration;

public static class DiConfigurator
{
    public static void ConfigureAppServices(this IServiceCollection services)
    {
        services.AddScoped<IUsersService, UsersService>();
        services.AddScoped<IPeriodService, PeriodService>();

    }
}