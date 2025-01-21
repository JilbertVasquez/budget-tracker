
using budget_tracker_client.Dtos;
using budget_tracker_client.Extensions;
using budget_tracker_client.Helpers;
using budget_tracker_client.Models;
using budget_tracker_client.Shared;
using Microsoft.EntityFrameworkCore;

namespace budget_tracker_client.Commissions;

public interface ICommissionServices
{
    Task<Result<CommissionForListDto, string>> GetCommissions(DateFilterDto dateFilterDto);

}

public class CommissionService(DataContext db, IAuthGuard ag, ILogger<ICommissionServices> logger) : ICommissionServices
{
    private readonly DataContext _db = db;
    private readonly IAuthGuard _ag = ag;

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