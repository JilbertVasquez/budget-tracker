
using budget_tracker_client.Users;

namespace budget_tracker_client.Configuration;

public static class DiConfigurator
{
    public static void ConfigureAppServices(this IServiceCollection services)
    {
        services.AddScoped<IUsersService, UsersService>();

    }
}