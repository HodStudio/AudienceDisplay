using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AudienceDisplay.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        public ColorConfiguration ColorConfiguration { get; set; }

        public IndexModel(ILogger<IndexModel> logger, IOptions<ColorConfigurationOptions> colorConfiguration)
        {
            _logger = logger;
            ColorConfiguration = colorConfiguration.Value.ColorConfiguration;
        }

        public void OnGet()
        {

        }
    }
}
