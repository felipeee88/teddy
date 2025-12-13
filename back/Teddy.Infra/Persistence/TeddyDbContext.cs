using Microsoft.EntityFrameworkCore;
using Teddy.Domain.Entities;

namespace Teddy.Infra.Persistence;

public class TeddyDbContext : DbContext
{
    public TeddyDbContext(DbContextOptions<TeddyDbContext> options) : base(options)
    {
    }

    public DbSet<Client> Clients => Set<Client>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TeddyDbContext).Assembly);
    }
}
