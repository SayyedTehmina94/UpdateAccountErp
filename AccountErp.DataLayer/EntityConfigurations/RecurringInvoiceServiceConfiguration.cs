using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.DataLayer.EntityConfigurations
{
    public class RecurringInvoiceServiceConfiguration : IEntityTypeConfiguration<RecurringInvoiceService>
    {
        public void Configure(EntityTypeBuilder<RecurringInvoiceService> builder)
        {
            builder.ToTable("RecurringInvoiceServices");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.RecInvoiceId).IsRequired();
            builder.Property(x => x.ServiceId).IsRequired();
            builder.Property(x => x.Rate).IsRequired().HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.Price).IsRequired().HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.TaxId).IsRequired(false);
            builder.Property(x => x.Quantity).IsRequired();
            builder.Property(x => x.TaxPercentage).IsRequired(false);
            builder.Property(x => x.TaxPrice).IsRequired().HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.LineAmount).IsRequired().HasColumnType("NUMERIC(12,2)");
            builder.HasOne(x => x.Service).WithMany().HasForeignKey(x => x.ServiceId);
            builder.HasOne(x => x.Taxes).WithMany().HasForeignKey(x => x.TaxId);
        }
    }
}
