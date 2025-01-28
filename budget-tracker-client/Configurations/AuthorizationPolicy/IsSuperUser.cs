
namespace budget_tracker_client.Configuration.AuthorizationPolicy;

public class IsSuperUser() : HasPermissionHandler<IsSuperUserRequirement>();

public class IsSuperUserRequirement() : PErmissionRequirement(["superuser"]);