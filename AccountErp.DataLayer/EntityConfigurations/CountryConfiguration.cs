using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AccountErp.DataLayer.EntityConfigurations
{
    public class CountryConfiguration : IEntityTypeConfiguration<Country>
    {
        public void Configure(EntityTypeBuilder<Country> builder)
        {
            builder.ToTable("Countries");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id).ValueGeneratedNever();

            builder.Property(x => x.Name).IsRequired(false).HasMaxLength(1000);
            builder.Property(x => x.IsoCode).IsRequired(false).HasMaxLength(10);
            builder.Property(x => x.Status).IsRequired();

            builder.HasMany(x => x.Addresses).WithOne().HasForeignKey(x => x.CountryId);
        }
    }
}
