
using budget_tracker_client.Models;
using budget_tracker_client.Shared;
using Microsoft.EntityFrameworkCore;

namespace budget_tracker_client.Periods;

public interface IPeriodServices
{
    Task<Result<PeriodDto, string>> GetPeriod(int periodId);
    Task<Result<PeriodsForListDto, string>> GetPeriods();
    Task<Result<bool, string>> CreatePeriod(CreatePeriodDto dto);
    Task<Result<bool, string>> UpdatePeriod(int periodId, UpdatePeriodDto dto);
    Task<Result<bool, string>> DeletePeriod(int periodId);
}

public class PeriodService(DataContext db, ILogger<PeriodService> logger) : IPeriodServices
{
    private readonly DataContext _db = db;

    public async Task<Result<PeriodDto, string>> GetPeriod(int periodId)
    {
        try
        {
            var period = await _db.Periods.FindAsync(periodId);
            if (period == null) return "Failed to get period";

            return new PeriodDto(
                period.PeriodId,
                period.Name,
                period.Description,
                period.CreatedAt
            );
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get period.");
            return "Failed to get Period.";
        }
    }

    public async Task<Result<PeriodsForListDto, string>> GetPeriods()
    {
        try
        {
            var periods = await _db.Periods
                .Where(p => p.IsDeleted == null)
                .ToListAsync();

            var periodsList = periods.Select(x => new PeriodDto(
                x.PeriodId,
                x.Name,
                x.Description,
                x.CreatedAt
            )).ToArray();

            return new PeriodsForListDto(periodsList);
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

    public async Task<Result<bool, string>> UpdatePeriod(int periodId, UpdatePeriodDto dto)
    {
        try
        {
            var period = await _db.Periods.FindAsync(periodId);

            if (period == null || period.IsDeleted != null) return "Period not found.";

            period.Name = dto.Name ?? period.Name;
            period.Description = dto.Description ?? period.Description;
            period.CreatedAt = period.CreatedAt;
            period.IsDeleted = period.IsDeleted;

            await _db.SaveChangesAsync();

            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to update period.");
            return "Failed to update period.";
        }
    }

    public async Task<Result<bool, string>> DeletePeriod(int periodId)
    {
        try
        {
            var period = await _db.Periods.FindAsync(periodId);

            if (period == null || period.IsDeleted != null) return "Period not found.";

            period.IsDeleted = true;

            await _db.SaveChangesAsync();

            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to delete period.");
            return "Failed to delete period.";
        }
    }
}