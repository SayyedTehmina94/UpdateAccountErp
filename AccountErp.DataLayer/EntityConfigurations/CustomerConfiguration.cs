using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AccountErp.DataLayer.EntityConfigurations
{
    public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.ToTable("Customers");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.AddressId).IsRequired(false);

            builder.Property(x => x.FirstName).IsRequired().HasMaxLength(250);
            builder.Property(x => x.MiddleName).HasMaxLength(250);
            builder.Property(x => x.LastName).HasMaxLength(250);
            builder.Property(x => x.Email).IsRequired().HasMaxLength(250);
            builder.Property(x => x.Phone).IsRequired(false).HasMaxLength(50);
            builder.Property(x => x.Status).IsRequired();
            builder.Property(x => x.CreatedOn).IsRequired();
            builder.Property(x => x.CreatedBy).IsRequired().HasMaxLength(40);
            builder.Property(x => x.UpdatedOn).IsRequired(false);
            builder.Property(x => x.UpdatedBy).HasMaxLength(40);
            builder.Property(x => x.AccountNumber).IsRequired(false).HasMaxLength(50);
            builder.Property(x => x.BankName).IsRequired(false).HasMaxLength(250);
            builder.Property(x => x.BankBranch).IsRequired(false).HasMaxLength(250);
            builder.Property(x => x.Ifsc).IsRequired(false).HasMaxLength(50);
            builder.Property(x => x.Discount).IsRequired(false).HasColumnType("NUMERIC(5,2)");
            
            builder.HasMany(x => x.Invoices).WithOne().HasForeignKey(x => x.CustomerId);
        }
    }
}
