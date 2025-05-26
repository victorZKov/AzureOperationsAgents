using AzureOperationsAgents.Core.Entities;
using AzureOperationsAgents.Core.Models.Chat;
using AzureOperationsAgents.Core.Models.Configuration;
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
        public DbSet<UserConfiguration> UserConfigurations { get; set; }
        public DbSet<ModelEntity> Models { get; set; }
        public DbSet<InstructionConfiguration> InstructionConfigurations { get; set; }

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
                entity.Property(d => d.EngineName).HasMaxLength(50); // Added EngineName configuration
                entity.Property(d => d.ModelName).HasMaxLength(100); // Added ModelName configuration
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
            
            // UserConfiguration entity
            modelBuilder.Entity<UserConfiguration>(entity =>
            {
                entity.ToTable("UserConfigurations");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(100);
                    
                entity.Property(e => e.OpenAIKey)
                    .HasMaxLength(100);
                    
                entity.Property(e => e.OpenAIEndpoint)
                    .HasMaxLength(200);
                    
                entity.Property(e => e.OpenAIModel)
                    .HasMaxLength(50);
                    
                entity.Property(e => e.OllamaServer)
                    .HasMaxLength(200);
                    
                entity.Property(e => e.OllamaModel)
                    .HasMaxLength(50);
                    
                entity.Property(e => e.SerperApiKey)
                    .HasMaxLength(100);
                    
                entity.Property(e => e.SerperApiEndpoint)
                    .HasMaxLength(200);
                
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
                    
                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
                    
                // Add a unique index on UserId and IsDefault to ensure a user can only have one default config
                entity.HasIndex(e => new { e.UserId, e.IsDefault })
                    .IsUnique()
                    .HasFilter("[IsDefault] = 1");
            });
            
            // ModelEntity entity
            modelBuilder.Entity<ModelEntity>(entity =>
            {
                entity.ToTable("Models");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.EngineName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.ModelName)
                    .IsRequired()
                    .HasMaxLength(100);

                // DisplayName is a computed property, so it doesn't need to be configured here
                // entity.Property(e => e.DisplayName)
                //    .IsRequired()
                //    .HasMaxLength(200);

                entity.HasIndex(m => new { m.EngineName, m.ModelName }).IsUnique(); // Ensure unique model per engine
            });
            
            // InstructionConfiguration entity
            modelBuilder.Entity<InstructionConfiguration>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Key).IsRequired().HasMaxLength(100);
                entity.Property(c => c.Value).IsRequired();
                entity.Property(c => c.Description).HasMaxLength(255);
                entity.Property(c => c.CreatedAt).IsRequired();
                entity.Property(c => c.UpdatedAt).IsRequired();
                entity.Property(c => c.IsActive).IsRequired().HasDefaultValue(true);
            });
        }
    }
}
