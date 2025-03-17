
namespace budget_tracker_client.Configuration.AuthorizationPolicy;

public class IsCommissioner() : HasPermissionHandler<IsCommissionerRequirement>();

public class IsCommissionerRequirement() : PermissionRequirement(["commissioner"]);