using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AccountErp.DataLayer.EntityConfigurations
{
    public class BillConfiguration : IEntityTypeConfiguration<Bill>
    {
        public void Configure(EntityTypeBuilder<Bill> builder)
        {
            builder.ToTable("Bills");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.VendorId).IsRequired();
            builder.Property(x => x.RefrenceNumber).IsRequired(false).HasMaxLength(50);
            builder.Property(x => x.Tax).IsRequired(false).HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.Discount).IsRequired(false).HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.TotalAmount).IsRequired().HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.Remark).IsRequired(false).HasMaxLength(1000);
            builder.Property(x => x.Status).IsRequired();

            builder.Property(x => x.DueDate).IsRequired(false);
            builder.Property(x => x.CreatedOn).IsRequired();
            builder.Property(x => x.CreatedBy).IsRequired().HasMaxLength(40);
            builder.Property(x => x.UpdatedOn).IsRequired(false);
            builder.Property(x => x.UpdatedBy).HasMaxLength(40);
            builder.Property(x => x.BillDate).IsRequired();
            builder.Property(x => x.StrBillDate).IsRequired(false);
            builder.Property(x => x.StrDueDate).IsRequired(false);
            builder.Property(x => x.PoSoNumber).IsRequired(false).HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.BillNumber).IsRequired(false);
            builder.Property(x => x.SubTotal).IsRequired(false).HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.LineAmountSubTotal).IsRequired(false).HasColumnType("NUMERIC(12,2)");

            builder.HasMany(x => x.Items).WithOne().HasForeignKey(x => x.BillId);
            builder.HasMany(x => x.Attachments).WithOne().HasForeignKey(x => x.BillId);
        }
    }
}
