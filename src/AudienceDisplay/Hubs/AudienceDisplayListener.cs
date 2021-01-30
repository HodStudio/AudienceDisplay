using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace AudienceDisplay.Hubs
{
    public class AudienceDisplayListener : Hub
    {
        private readonly ILogger<AudienceDisplayListener> _logger;

        public AudienceDisplayListener(ILogger<AudienceDisplayListener> logger)
        {
            _logger = logger;
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string newId, string author, string imageSrc, string message)
        {
            _logger.LogInformation($"Message receiveid!\nId: {newId}\nAuthor: {author}\nMessage: {message}");
            await Clients.All.SendAsync("ReceiveMessage", newId, author, imageSrc, message);
        }
    }
}
