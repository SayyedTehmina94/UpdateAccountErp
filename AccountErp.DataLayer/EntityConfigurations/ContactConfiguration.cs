using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AccountErp.DataLayer.EntityConfigurations
{
    public class ContactConfiguration : IEntityTypeConfiguration<Contact>
    {
        public void Configure(EntityTypeBuilder<Contact> builder)
        {
            builder.ToTable("Contacts");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.AddressId).IsRequired(false);
            builder.Property(x => x.VendorId).IsRequired();

            builder.Property(x => x.FirstName).IsRequired(false).HasMaxLength(250);
            builder.Property(x => x.MiddleName).IsRequired(false).HasMaxLength(250);
            builder.Property(x => x.LastName).IsRequired(false).HasMaxLength(250);
            builder.Property(x => x.JobTitle).IsRequired(false).HasMaxLength(250);
            builder.Property(x => x.Phone).IsRequired(false).HasMaxLength(50);
            builder.Property(x => x.Email).IsRequired(false).HasMaxLength(250);
        }
    }
}
