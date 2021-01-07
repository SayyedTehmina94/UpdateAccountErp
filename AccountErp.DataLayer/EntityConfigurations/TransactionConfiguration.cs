using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.DataLayer.EntityConfigurations
{
    public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.ToTable("Transaction");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.TransactionId).IsRequired(false);
            builder.Property(x => x.CompanyId).IsRequired(false);
            builder.Property(x => x.BankAccountId).IsRequired(false);
            builder.Property(x => x.ContactId).IsRequired(false);
            builder.Property(x => x.TransactionTypeId).IsRequired();
            builder.Property(x => x.Description).IsRequired(false).HasMaxLength(100);
            builder.Property(x => x.TransactionNumber).IsRequired(false).HasMaxLength(50);
            builder.Property(x => x.Status).IsRequired();

            builder.Property(x => x.TransactionDate).IsRequired();
            builder.Property(x => x.DebitAmount).IsRequired().HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.CreditAmount).IsRequired().HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.CreationDate).IsRequired();
            builder.Property(x => x.ModifyDate).IsRequired(false);
            builder.Property(x => x.ContactType).IsRequired(false);
            builder.Property(x => x.isForTransEntry).IsRequired(false);
        }
    }
}
