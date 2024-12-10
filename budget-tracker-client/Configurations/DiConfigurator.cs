
using budget_tracker_client.Users;
using budget_tracker_client.Periods;
using budget_tracker_client.Expenses;
using budget_tracker_client.FixedExpenses;
using budget_tracker_client.Budgets;

namespace budget_tracker_client.Configuration;

public static class DiConfigurator
{
    public static void ConfigureAppServices(this IServiceCollection services)
    {
        services.AddScoped<IUsersServices, UsersService>();
        services.AddScoped<IPeriodServices, PeriodService>();
        services.AddScoped<IExpenseServices, ExpenseService>();
        services.AddScoped<IFixedExpenseServices, FixedExpenseService>();
        services.AddScoped<IBudgetServices, BudgetService>();
    }
}