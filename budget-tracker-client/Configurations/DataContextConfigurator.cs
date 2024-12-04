using budget_tracker_client.Shared;
using Microsoft.EntityFrameworkCore;

namespace budget_tracker_client.Configuration
{
    public static class DataContextConfigurator
    {
        public static void SetupDataContext(this WebApplicationBuilder builder, AppSettings appSettings)
        {
            builder.Services.AddDbContext<DataContext>(options =>
            {
                options.UseMySql(appSettings.ConnectionString ?? "", ServerVersion.Parse("8.0.24"));
            });
        }
    }
}