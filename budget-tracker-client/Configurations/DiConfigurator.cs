
using budget_tracker_client.Users;
// using budget_tracker_client.Periods;
using budget_tracker_client.Expenses;
using budget_tracker_client.FixedExpenses;
using budget_tracker_client.Budgets;
using budget_tracker_client.Savings;
using budget_tracker_client.Helpers;
using budget_tracker_client.Commissions;

namespace budget_tracker_client.Configuration;

public static class DiConfigurator
{
    public static void ConfigureAppServices(this IServiceCollection services)
    {
        services.AddScoped<IUsersServices, UsersService>();
        // services.AddScoped<IPeriodServices, PeriodService>();
        services.AddScoped<IExpenseServices, ExpenseService>();
        services.AddScoped<IFixedExpenseServices, FixedExpenseService>();
        services.AddScoped<IBudgetServices, BudgetService>();
        services.AddScoped<ISavingServices, SavingService>();
        services.AddScoped<ICommissionServices, CommissionService>();
        services.AddScoped<IAuthGuard, AuthGuard>();
    }
}