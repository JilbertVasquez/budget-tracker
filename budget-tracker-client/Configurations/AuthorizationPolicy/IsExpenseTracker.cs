
namespace budget_tracker_client.Configuration.AuthorizationPolicy;

public class IsExpenseTracker() : HasPermissionHandler<IsExpenseTrackerRequirement>();

public class IsExpenseTrackerRequirement() : PermissionRequirement(["expense-tracker"]);