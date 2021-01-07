using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AccountErp.DataLayer.EntityConfigurations
{
    public class AddressConfiguration : IEntityTypeConfiguration<Address>
    {
        public void Configure(EntityTypeBuilder<Address> builder)
        {
            builder.ToTable("Addresses");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            builder.Property(x => x.CountryId).IsRequired(false);

            builder.Property(x => x.StreetNumber).IsRequired(false).HasMaxLength(50);
            builder.Property(x => x.StreetName).IsRequired(false).HasMaxLength(100);
            builder.Property(x => x.City).IsRequired(false).HasMaxLength(1000);
            builder.Property(x => x.State).IsRequired(false).HasMaxLength(100);
            builder.Property(x => x.PostalCode).IsRequired(false).HasMaxLength(50);

            builder.HasOne(x => x.Country).WithMany().HasForeignKey(x => x.CountryId);
            builder.Property(x => x.Phone).IsRequired(false).HasMaxLength(50);

        }
    }
}
