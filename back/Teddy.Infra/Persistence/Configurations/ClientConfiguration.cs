using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Teddy.Domain.Entities;

namespace Teddy.Infra.Persistence.Configurations;

public class ClientConfiguration : IEntityTypeConfiguration<Client>
{
    public void Configure(EntityTypeBuilder<Client> builder)
    {
        builder.ToTable("clients");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasColumnType("uuid")
            .IsRequired();

        builder.Property(e => e.Name)
            .HasColumnName("name")
            .HasColumnType("varchar(150)")
            .IsRequired();

        builder.Property(e => e.Salary)
            .HasColumnName("salary")
            .HasColumnType("numeric(18,2)")
            .IsRequired();

        builder.Property(e => e.CompanyValue)
            .HasColumnName("company_value")
            .HasColumnType("numeric(18,2)")
            .IsRequired();

        builder.Property(e => e.AccessCount)
            .HasColumnName("access_count")
            .HasColumnType("integer")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamp without time zone")
            .IsRequired();

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("timestamp without time zone")
            .IsRequired();

        builder.Property(e => e.DeletedAt)
            .HasColumnName("deleted_at")
            .HasColumnType("timestamp without time zone")
            .IsRequired(false);

        builder.HasIndex(e => e.Name)
            .HasDatabaseName("ix_clients_name");

        builder.HasIndex(e => e.DeletedAt)
            .HasDatabaseName("ix_clients_deleted_at");

        builder.HasQueryFilter(e => e.DeletedAt == null);
    }
}
