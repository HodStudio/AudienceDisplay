using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace AudienceDisplay.Hubs
{
    public class AudienceDisplayListener : Hub
    {
        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string newId, string author, string imageSrc, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", newId, author, imageSrc, message);
        }
    }
}
