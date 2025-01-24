namespace budget_tracker_client.Configuration;

public class AppSettings
{
    public string ConnectionString { get; set; } = default!;
    public string TokenSigningKey { get; set; } = default!;
    public string Auth0Audience { get; set; } = default!;
    public string Auth0Authority { get; set; } = default!;
}