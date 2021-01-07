using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace AccountErp.DataLayer.EntityConfigurations
{
    public class COA_AccountMasterConfiguration : IEntityTypeConfiguration<COA_AccountMaster>
    {
        public void Configure(EntityTypeBuilder<COA_AccountMaster> builder)
        {
            builder.ToTable("COA_AccountMaster");

            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            builder.Property(x => x.AccountMasterName).IsRequired();
            builder.HasMany(x => x.AccountTypes).WithOne().HasForeignKey(x => x.COA_AccountMasterId) ;
        }
    }
}
