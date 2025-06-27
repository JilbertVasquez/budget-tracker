using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.FileProviders.Physical;

namespace budget_tracker_client.Configuration;

public static class FallbackConfigurator
{
    public static void MapCustomFallbackToFile(this WebApplication app)
    {
        app.Use(async (context, next) => {
            if (!context.Request.Path.StartsWithSegments("/api"))
            {
                var fileInfo = new PhysicalFileInfo(new(Path.Combine(app.Environment.WebRootPath, "index.html")));
                await context.Response.SendFileAsync(fileInfo);
                return;
            }
            await next();
        });
    }
}