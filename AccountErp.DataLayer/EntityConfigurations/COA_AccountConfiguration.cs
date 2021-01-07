using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.DataLayer.EntityConfigurations
{
    public class COA_AccountConfiguration : IEntityTypeConfiguration<COA_Account>
    {
        public void Configure(EntityTypeBuilder<COA_Account> builder)
        {
            builder.ToTable("COA_Account");

            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            builder.Property(x => x.COA_AccountTypeId).IsRequired();
            builder.Property(x => x.AccountName).IsRequired();
            builder.Property(x => x.AccountCode).HasMaxLength(50);
            builder.Property(x => x.Description).HasMaxLength(100);
        }
    }
}