
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
    Task<Result<CommissionForListDto, string>> GetCommissions(DateFilterDto dateFilterDto);
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

                var commission = new Commission(dto)
                {
                    CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
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
    public async Task<Result<CommissionForListDto, string>> GetCommissions(DateFilterDto dateFilterDto)
    {
        try
        {
            dateFilterDto.EnsureStartBeforeEnd();
            dateFilterDto.StartDate = dateFilterDto.GetStartOfStartDate();
            dateFilterDto.EndDate = dateFilterDto.GetEndOfEndDate();
            var userId = _ag.GetUserId();

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
}