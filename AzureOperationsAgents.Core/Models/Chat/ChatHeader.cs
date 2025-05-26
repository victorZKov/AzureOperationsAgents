using AzureOperationsAgents.Core.Models.Projects;

namespace AzureOperationsAgents.Core.Models.Chat
{
    public class ChatHeader
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int? ProjectId { get; set; }
        public Project? Project { get; set; }

        public ICollection<ChatDetail> Messages { get; set; } = new List<ChatDetail>();
    }
}