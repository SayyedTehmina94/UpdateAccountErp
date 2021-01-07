using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.DataLayer.EntityConfigurations
{
    public class COA_AccountTypeConfiguration : IEntityTypeConfiguration<COA_AccountType>
    {
        public void Configure(EntityTypeBuilder<COA_AccountType> builder)
        {
            builder.ToTable("COA_AccountType");

            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            builder.Property(x => x.COA_AccountMasterId).IsRequired();
            builder.Property(x => x.AccountTypeName).IsRequired();
            builder.Property(x => x.AccountTypeCode).IsRequired();
            builder.HasMany(x => x.BanKAccount).WithOne().HasForeignKey(x => x.COA_AccountTypeId);
        }
    }
}