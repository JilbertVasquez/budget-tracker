
using budget_tracker_client.Users;
using budget_tracker_client.Periods;
using budget_tracker_client.Expenses;

namespace budget_tracker_client.Configuration;

public static class DiConfigurator
{
    public static void ConfigureAppServices(this IServiceCollection services)
    {
        services.AddScoped<IUsersServices, UsersService>();
        services.AddScoped<IPeriodServices, PeriodService>();
        services.AddScoped<IExpenseServices, ExpenseService>();
    }
}