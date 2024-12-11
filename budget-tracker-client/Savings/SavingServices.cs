
using budget_tracker_client.Shared;

namespace budget_tracker_client.Savings;

public interface ISavingServices
{

}

public class SavingService(DataContext db, ILogger<SavingService> logger) : ISavingServices
{
    private readonly DataContext _db = db;
}