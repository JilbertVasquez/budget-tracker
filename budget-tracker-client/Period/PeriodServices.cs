
using System.Data.Common;
using budget_tracker_client.Models;
using budget_tracker_client.Periods;
using budget_tracker_client.Shared;

namespace budget_tracker_clients.Periods;

public interface IPeriodService
{
    Task<Result<bool, string>> CreatePeriod(CreatePeriodDto dto);
}

public class PeriodService(DataContext db, ILogger<PeriodService> logger) : IPeriodService
{
    private readonly DataContext _db = db;

    public async Task<Result<bool, string>> CreatePeriod(CreatePeriodDto dto)
    {
        try
        {
            if (string.IsNullOrEmpty(dto.Name)) return "Invalid name.";

            var period = new Period(dto);
            _db.Periods.Add(period);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to create period.");
            return "Failed to create period.";
        }
    }
}