using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AccountErp.DataLayer.EntityConfigurations
{
    public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
    {
        public void Configure(EntityTypeBuilder<Invoice> builder)
        {
            builder.ToTable("Invoices");

            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            builder.Property(x => x.CustomerId).IsRequired();
            builder.Property(x => x.InvoiceNumber).IsRequired().HasMaxLength(50);
            builder.Property(x => x.Tax).IsRequired(false).HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.Discount).IsRequired(false).HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.TotalAmount).IsRequired().HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.Remark).IsRequired().IsRequired(false).HasMaxLength(1000);
            builder.Property(x => x.CreatedOn).IsRequired();
            builder.Property(x => x.CreatedBy).IsRequired().HasMaxLength(40);
            builder.Property(x => x.UpdatedOn).IsRequired(false);
            builder.Property(x => x.UpdatedBy).HasMaxLength(40);

            builder.Property(x => x.PoSoNumber).IsRequired(false).HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.InvoiceDate).IsRequired();
            builder.Property(x => x.StrInvoiceDate).IsRequired(false);
            builder.Property(x => x.DueDate).IsRequired();
            builder.Property(x => x.StrDueDate).IsRequired(false);
            builder.Property(x => x.SubTotal).IsRequired(false).HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.LineAmountSubTotal).IsRequired(false).HasColumnType("NUMERIC(12,2)");

            builder.HasMany(x => x.Services).WithOne().HasForeignKey(x => x.InvoiceId);
            builder.HasMany(x => x.Attachments).WithOne().HasForeignKey(x => x.InvoiceId);
        }
    }
}
