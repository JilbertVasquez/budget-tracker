
using budget_tracker_client.Dtos;
using budget_tracker_client.Extensions;
using budget_tracker_client.Helpers;
using budget_tracker_client.Models;
using budget_tracker_client.Shared;
using Microsoft.EntityFrameworkCore;

namespace budget_tracker_client.Commissions;

public interface ICommissionServices
{
    Task<Result<bool, string>> AddCommission(CreateCommissionDto dto);
    Task<Result<bool, string>> CashOutCommission(CreateCommissionDto dto);
    Task<Result<CommissionDetailsDto, string>> GetCommission(int commissionId);
    Task<Result<CommissionForListDto, string>> GetCommissions(DateFilterDto dateFilterDto);
    Task<Result<bool, string>> UpdateCommission(int commissionId, UpdateCommissionDto dto);
    Task<Result<bool, string>> DeleteCommission(int commissionId);
}

public class CommissionService(DataContext db, IAuthGuard ag, ILogger<ICommissionServices> logger) : ICommissionServices
{
    private readonly DataContext _db = db;
    private readonly IAuthGuard _ag = ag;

    public async Task<Result<bool, string>> AddCommission(CreateCommissionDto dto)
    {
        try
        {
            if (string.IsNullOrEmpty(dto.Name)) return "Invalid Name.";
            if (string.IsNullOrEmpty(dto.Description)) return "Invalid Description.";

            var userId = await _ag.GetUserId(_db);
            var commission = new Commission(dto)
            {
                CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow),
                UserId = userId
            };
            _db.Commissions.Add(commission);

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to add commission.");
            return "Failed to add commission.";
        }
    }

    public async Task<Result<bool, string>> CashOutCommission(CreateCommissionDto dto)
    {
        try
        {
            if (string.IsNullOrEmpty(dto.Name)) return "Invalid Name.";
            if (string.IsNullOrEmpty(dto.Description)) return "Invalid Description.";

            var userId = await _ag.GetUserId(_db);
            dto = dto with { Amount = dto.Amount > 0 ? dto.Amount * -1 : dto.Amount };

            var commission = new Commission(dto)
            {
                UserId = userId,
                CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
            };
            _db.Commissions.Add(commission);

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to add cashout commission.");
            return "Failed to add cashout commission.";
        }
    }

    public async Task<Result<CommissionDetailsDto, string>> GetCommission(int commissionId)
    {
        try
        {
            var userId = await _ag.GetUserId(_db);

            var commission = await _db.Commissions
                .Where(x => x.UserId == userId && x.CommissionId == commissionId && x.IsDeleted == null)
                .FirstOrDefaultAsync();
            
            if (commission == null) return "Failed to get commission.";

            return new CommissionDetailsDto(
                commission.CommissionId, 
                commission.Name, 
                commission.Description, 
                commission.Note, 
                commission.Amount, 
                commission.Category, 
                commission.CreatedAt
            );
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get commission.");
            return "Failed to get commission.";
        }
    }
    public async Task<Result<CommissionForListDto, string>> GetCommissions(DateFilterDto dateFilterDto)
    {
        try
        {
            dateFilterDto.EnsureStartBeforeEnd();
            dateFilterDto.StartDate = dateFilterDto.GetStartOfStartDate();
            dateFilterDto.EndDate = dateFilterDto.GetEndOfEndDate();
            var userId = await _ag.GetUserId(_db);

            var commissions = await _db.Commissions
                .Where(x => 
                    x.UserId == userId && 
                    x.IsDeleted == null &&
                    x.CreatedAt >= dateFilterDto.StartDate &&
                    x.CreatedAt <= dateFilterDto.EndDate
                    )
                .ToListAsync();

            var commissionsList = commissions.Select(x => new CommissionDetailsDto(
                x.CommissionId,
                x.Name,
                x.Description,
                x.Note,
                x.Amount,
                x.Category,
                x.CreatedAt
            )).ToArray();

            return new CommissionForListDto(commissionsList);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get commissions.");
            return "Failed to get commissions.";
        }
    }

    public async Task<Result<bool, string>> UpdateCommission(int commissionId, UpdateCommissionDto dto)
    {
        try
        {
            var commission = await _db.Commissions.FindAsync(commissionId);
            var userId = await _ag.GetUserId(_db);

            if (commission == null || commission.UserId != userId || commission.IsDeleted != null) return "Failed to update commission.";

            commission.Name = dto.Name;
            commission.Description = dto.Description;
            commission.Note = dto.Note;
            commission.Amount = dto.Amount;
            commission.Category = dto.Category;

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to update commission.");
            return "Failed to update commission.";
        }
    }

    public async Task<Result<bool, string>> DeleteCommission(int commissionId)
    {
        try
        {
            var userId = await _ag.GetUserId(_db);

            var commission = await _db.Commissions.FindAsync(commissionId);
            if (commission == null || commission.UserId != userId || commission.IsDeleted != null) return "Failed to delete commission.";

            commission.IsDeleted = true;

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to delete commission.");
            return "Failed to delete commission.";
        }
    }
}