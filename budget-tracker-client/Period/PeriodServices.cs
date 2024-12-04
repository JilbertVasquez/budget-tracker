
using System.Data.Common;
using budget_tracker_client.Models;
using budget_tracker_client.Periods;
using budget_tracker_client.Shared;
using Microsoft.EntityFrameworkCore;

namespace budget_tracker_clients.Periods;

public interface IPeriodService
{
    Task<Result<PeriodDto[], string>> GetPeriod();
    Task<Result<bool, string>> CreatePeriod(CreatePeriodDto dto);
}

public class PeriodService(DataContext db, ILogger<PeriodService> logger) : IPeriodService
{
    private readonly DataContext _db = db;

    public async Task<Result<PeriodDto[], string>> GetPeriod()
    {
        try {
            var periods = await _db.Periods
                .Select(p => new PeriodDto(
                    p.PeriodId,
                    p.Name,
                    p.Description,
                    p.CreatedAt
                ))
                .ToListAsync();
            
            return periods.ToArray();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get periods.");
            return "Failed to get Periods.";
        }
    }

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