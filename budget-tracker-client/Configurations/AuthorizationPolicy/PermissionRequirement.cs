
using Microsoft.AspNetCore.Authorization;

namespace budget_tracker_client.Configuration.AuthorizationPolicy;

public class PermissionRequirement(string[]? permissions = null) : IAuthorizationRequirement
{
    public string[] RequiredPermissions { get; protected init; } = permissions ?? [];
    public bool MustHaveAllPermissions { get; protected init; } = true;
}