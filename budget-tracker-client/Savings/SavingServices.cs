
using budget_tracker_client.Models;
using budget_tracker_client.Shared;

namespace budget_tracker_client.Savings;

public interface ISavingServices
{
    Task<Result<bool, string>> AddSaving(CreateSavingDto dto);
}

public class SavingService(DataContext db, ILogger<SavingService> logger) : ISavingServices
{
    private readonly DataContext _db = db;

    public async Task<Result<bool, string>> AddSaving(CreateSavingDto dto)
    {
        try
        {
            if (string.IsNullOrEmpty(dto.Name)) return "Invalid Name.";
            if (string.IsNullOrEmpty(dto.Description)) return "Invalid Description.";

            var saving = new Saving(dto)
            {
                CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
            };
            _db.Savings.Add(saving);

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to add saving.");
            return "Failed to add saving.";
        }
    }
}