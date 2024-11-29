namespace budget_tracker_client.Configuration;

public static class AppSettingsConfigurator
{
    public static AppSettings SetupAppSettings(this WebApplicationBuilder builder)
    {
        var appSettings = new AppSettings();
        builder.Services.Configure<AppSettings>(builder.Configuration.GetSection(nameof(AppSettings)));
        builder.Configuration.GetSection(nameof(AppSettings)).Bind(appSettings);
        return appSettings;
    }
}