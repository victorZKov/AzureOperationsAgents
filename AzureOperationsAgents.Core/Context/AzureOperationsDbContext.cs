using AzureOperationsAgents.Core.Models.Chat;
using AzureOperationsAgents.Core.Models.Learning;
using AzureOperationsAgents.Core.Models.Projects;
using Microsoft.EntityFrameworkCore;

namespace AzureOperationsAgents.Core.Context
{
    public class AzureOperationsDbContext : DbContext
    {
        public AzureOperationsDbContext(DbContextOptions<AzureOperationsDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; }  
        public DbSet<ChatHeader> ChatHeaders { get; set; }
        public DbSet<ChatDetail> ChatDetails { get; set; }
        public DbSet<KnowledgeSnippet> KnowledgeSnippets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Project entity
            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
                entity.Property(p => p.UserId).IsRequired();
                entity.Property(p => p.CreatedAt).IsRequired();
            });

            // ChatHeader entity
            modelBuilder.Entity<ChatHeader>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Title).HasMaxLength(200);
                entity.Property(c => c.UserId).IsRequired();
                entity.Property(c => c.CreatedAt).IsRequired();

                entity.HasMany(c => c.Messages)
                    .WithOne(m => m.ChatHeader)
                    .HasForeignKey(m => m.ChatHeaderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(c => c.Project)
                    .WithMany() // Unidireccional
                    .HasForeignKey(c => c.ProjectId)
                    .OnDelete(DeleteBehavior.SetNull); 
            });

            // ChatDetail entity
            modelBuilder.Entity<ChatDetail>(entity =>
            {
                entity.HasKey(d => d.Id);
                entity.Property(d => d.Sender).IsRequired().HasMaxLength(20);
                entity.Property(d => d.Message).IsRequired();
                entity.Property(d => d.SentAt).IsRequired();
            });
            
            // KnowledgeSnippet entity
            modelBuilder.Entity<KnowledgeSnippet>(entity =>
            {
                entity.ToTable("KnowledgeSnippets");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.ChatTitle)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Content)
                    .IsRequired();

                entity.Property(e => e.EmbeddingJson)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
            });
        }
    }
}