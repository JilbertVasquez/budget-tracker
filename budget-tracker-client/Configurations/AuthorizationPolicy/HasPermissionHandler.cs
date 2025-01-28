
using Microsoft.AspNetCore.Authorization;

namespace budget_tracker_client.Configuration.AuthorizationPolicy;

public class HasPermissionHandler<T> : AuthorizationHandler<T> where T : PErmissionRequirement
{
    private const string _superUserPermission = "superuser";

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, T requirement)
    {
        if (requirement.RequiredPermissions is {Length: 0})
        {
            return Task.CompletedTask;
        }

        var permissions = context.User.Claims
            .Where(x => x.Type == "permissions")
            .Select(x => x.Value)
            .ToList();

        if (permissions.Any(x => x == _superUserPermission))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        if (requirement.MustHaveAllPermissions)
        {
            if (!requirement.RequiredPermissions.All(x => permissions.Any(y => y == x)))
            {
                return Task.CompletedTask;
            }

            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        if (!requirement.MustHaveAllPermissions)
        {
            if (!requirement.RequiredPermissions.Any(x => permissions.Any(y => y == x)))
            {
                return Task.CompletedTask;
            }

            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}