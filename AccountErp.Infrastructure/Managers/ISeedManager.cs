using System.Threading.Tasks;

namespace AccountErp.Infrastructure.Managers
{
    public interface ISeedManager
    {
        Task InitializeAsync();
    }
}
