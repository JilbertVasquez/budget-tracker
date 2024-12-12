namespace budget_tracker_client.Configuration;

public class AppSettings
{
    public string ConnectionString { get; set; } = default!;
    public string TokenSigningKey { get; set; } = default!;
}