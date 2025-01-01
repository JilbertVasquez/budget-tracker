
using budget_tracker_client.Helpers;
using budget_tracker_client.Models;
using budget_tracker_client.Shared;
using Microsoft.EntityFrameworkCore;

namespace budget_tracker_client.Savings;

public interface ISavingServices
{
    Task<Result<bool, string>> AddSaving(CreateSavingDto dto);
    Task<Result<bool, string>> WithdrawSaving(CreateSavingDto dto);
    Task<Result<SavingDetailsDto, string>> GetSaving(int savingId);
    Task<Result<SavingForListDto, string>> GetSavings();
    Task<Result<bool, string>> UpdateSaving(UpdateSavingDto dto, int savingId);
    Task<Result<bool, string>> DeleteSaving(int savingId);
}

public class SavingService(DataContext db, IAuthGuard ag,  ILogger<SavingService> logger) : ISavingServices
{
    private readonly DataContext _db = db;
    private readonly IAuthGuard _ag = ag;

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

    public async Task<Result<bool, string>> WithdrawSaving(CreateSavingDto dto)
    {
        try
        {
            if (string.IsNullOrEmpty(dto.Name)) return "Invalid Name.";
            if (string.IsNullOrEmpty(dto.Description)) return "Invalid Description.";

            dto = dto with { Amount = dto.Amount > 0 ? dto.Amount * -1 : dto.Amount };

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
            logger.LogError(e, "Failed to add withdrawal saving.");
            return "Failed to add withdrawal saving.";
        }
    }

    public async Task<Result<SavingDetailsDto, string>> GetSaving(int savingId)
    {
        try
        {
            var userId = _ag.GetUserId();

            var saving = await _db.Savings
                .Where(x => x.UserId == userId && x.SavingId == savingId && x.IsDeleted == null)
                // .Include(p => p.Period)
                .FirstOrDefaultAsync();

            if (saving == null) return "Failed to get saving.";

            return new SavingDetailsDto(
                saving.SavingId,
                saving.Name,
                saving.Description,
                saving.Note,
                saving.Amount,
                saving.Category,
                // saving.Period,
                saving.CreatedAt
            );
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get saving.");
            return "Failed to get saving.";
        }
    }

    public async Task<Result<SavingForListDto, string>> GetSavings()
    {
        try
        {
            var userId = _ag.GetUserId();

            var savings = await _db.Savings
                .Where(x => x.UserId == userId && x.IsDeleted == null)
                // .Include(p => p.Period)
                .ToListAsync();

            var savingsList = savings.Select(x => new SavingDetailsDto(
                x.SavingId,
                x.Name,
                x.Description,
                x.Note,
                x.Amount,
                x.Category,
                // x.Period,
                x.CreatedAt
            )).ToArray();

            return new SavingForListDto(savingsList);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get savings.");
            return "Failed to get savings.";
        }
    }

    public async Task<Result<bool, string>> UpdateSaving(UpdateSavingDto dto, int savingId)
    {
        try
        {
            var saving = await _db.Savings.FindAsync(savingId);

            if (saving == null || saving.IsDeleted != null || saving.IsDeleted != null) return "Failed to update saving.";

            saving.Name = dto.Name;
            saving.Description = dto.Description;
            saving.Note = dto.Note;
            saving.Amount = dto.Amount;
            saving.Category = dto.Category;
            // saving.Period = dto.Period;

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to update saving.");
            return "Failed to update saving.";
        }
    }

    public async Task<Result<bool, string>> DeleteSaving(int savingId)
    {
        try
        {
            var userId = _ag.GetUserId();

            var saving = await _db.Savings.FindAsync(savingId);

            if (saving == null || saving.UserId != userId || saving.IsDeleted != null) return "Failed to delete saving.";

            saving.IsDeleted = true;

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to delete saving.");
            return "Failed to delete saving.";
        }
    }
}