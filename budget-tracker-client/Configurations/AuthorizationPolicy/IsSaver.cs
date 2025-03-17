
namespace budget_tracker_client.Configuration.AuthorizationPolicy;

public class IsSaver() : HasPermissionHandler<IsSaverRequirement>();

public class IsSaverRequirement() : PermissionRequirement(["saver"]);