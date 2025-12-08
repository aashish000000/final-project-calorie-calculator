using CalorieCalculator.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace CalorieCalculator.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Food> Foods => Set<Food>();
    public DbSet<EntryItem> EntryItems => Set<EntryItem>();
    public DbSet<WaterEntry> WaterEntries => Set<WaterEntry>();
    public DbSet<FavoriteMeal> FavoriteMeals => Set<FavoriteMeal>();
    public DbSet<FavoriteMealItem> FavoriteMealItems => Set<FavoriteMealItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
        });

        // Food configuration
        modelBuilder.Entity<Food>(entity =>
        {
            entity.HasOne(f => f.User)
                  .WithMany(u => u.Foods)
                  .HasForeignKey(f => f.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // EntryItem configuration
        modelBuilder.Entity<EntryItem>(entity =>
        {
            entity.HasOne(e => e.User)
                  .WithMany(u => u.EntryItems)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Food)
                  .WithMany(f => f.EntryItems)
                  .HasForeignKey(e => e.FoodId)
                  .OnDelete(DeleteBehavior.NoAction); // Prevent cascade delete conflict
        });

        // WaterEntry configuration
        modelBuilder.Entity<WaterEntry>(entity =>
        {
            entity.HasOne(w => w.User)
                  .WithMany()
                  .HasForeignKey(w => w.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(w => new { w.UserId, w.Date });
        });

        // FavoriteMeal configuration
        modelBuilder.Entity<FavoriteMeal>(entity =>
        {
            entity.HasOne(fm => fm.User)
                  .WithMany()
                  .HasForeignKey(fm => fm.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // FavoriteMealItem configuration
        modelBuilder.Entity<FavoriteMealItem>(entity =>
        {
            entity.HasOne(fmi => fmi.FavoriteMeal)
                  .WithMany(fm => fm.Items)
                  .HasForeignKey(fmi => fmi.FavoriteMealId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(fmi => fmi.Food)
                  .WithMany()
                  .HasForeignKey(fmi => fmi.FoodId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Seed some global foods
        modelBuilder.Entity<Food>().HasData(
            new Food { Id = 1, Name = "Chicken Breast", CaloriesPer100g = 165, ProteinPer100g = 31, CarbsPer100g = 0, FatPer100g = 3.6m },
            new Food { Id = 2, Name = "Brown Rice", CaloriesPer100g = 112, ProteinPer100g = 2.6m, CarbsPer100g = 23.5m, FatPer100g = 0.9m },
            new Food { Id = 3, Name = "Broccoli", CaloriesPer100g = 34, ProteinPer100g = 2.8m, CarbsPer100g = 7, FatPer100g = 0.4m },
            new Food { Id = 4, Name = "Salmon", CaloriesPer100g = 208, ProteinPer100g = 20, CarbsPer100g = 0, FatPer100g = 13 },
            new Food { Id = 5, Name = "Egg", CaloriesPer100g = 155, ProteinPer100g = 13, CarbsPer100g = 1.1m, FatPer100g = 11 },
            new Food { Id = 6, Name = "Banana", CaloriesPer100g = 89, ProteinPer100g = 1.1m, CarbsPer100g = 23, FatPer100g = 0.3m },
            new Food { Id = 7, Name = "Apple", CaloriesPer100g = 52, ProteinPer100g = 0.3m, CarbsPer100g = 14, FatPer100g = 0.2m },
            new Food { Id = 8, Name = "Oatmeal", CaloriesPer100g = 68, ProteinPer100g = 2.4m, CarbsPer100g = 12, FatPer100g = 1.4m },
            new Food { Id = 9, Name = "Greek Yogurt", CaloriesPer100g = 59, ProteinPer100g = 10, CarbsPer100g = 3.6m, FatPer100g = 0.7m },
            new Food { Id = 10, Name = "Almonds", CaloriesPer100g = 579, ProteinPer100g = 21, CarbsPer100g = 22, FatPer100g = 50 }
        );
    }
}

