using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.DataLayer.EntityConfigurations
{
    public class QuotationConfiguration : IEntityTypeConfiguration<Quotation>
    {
        public void Configure(EntityTypeBuilder<Quotation> builder)
        {
            builder.ToTable("Quotations");

            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            builder.Property(x => x.CustomerId).IsRequired();
            builder.Property(x => x.QuotationNumber).IsRequired().HasMaxLength(50);
            builder.Property(x => x.Tax).IsRequired(false).HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.Discount).IsRequired(false).HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.TotalAmount).IsRequired().HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.Remark).IsRequired().IsRequired(false).HasMaxLength(1000);
            builder.Property(x => x.CreatedOn).IsRequired();
            builder.Property(x => x.CreatedBy).IsRequired().HasMaxLength(40);
            builder.Property(x => x.UpdatedOn).IsRequired(false);
            builder.Property(x => x.UpdatedBy).HasMaxLength(40);

            builder.Property(x => x.QuotationDate).IsRequired();
            builder.Property(x => x.StrQuotationDate).IsRequired(false);
            builder.Property(x => x.ExpireDate).IsRequired();
            builder.Property(x => x.StrExpireDate).IsRequired(false);
            builder.Property(x => x.PoSoNumber).IsRequired(false).HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.Memo).IsRequired(false);
            builder.Property(x => x.SubTotal).IsRequired(false).HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.LineAmountSubTotal).IsRequired(false).HasColumnType("NUMERIC(12,2)");

            builder.HasMany(x => x.Services).WithOne().HasForeignKey(x => x.QuotationId);
            builder.HasMany(x => x.Attachments).WithOne().HasForeignKey(x => x.QuotationId);
        }
    }
}

