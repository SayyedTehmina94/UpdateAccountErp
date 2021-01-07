
using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AccountErp.DataLayer.EntityConfigurations
{
    public class BankAccountConfiguration : IEntityTypeConfiguration<BankAccount>
    {
        public void Configure(EntityTypeBuilder<BankAccount> builder)
        {
            builder.ToTable("BankAccounts");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.AccountNumber).HasMaxLength(50);
            builder.Property(x => x.BankName).IsRequired(false).HasMaxLength(100);
            builder.Property(x => x.AccountHolderName).IsRequired(false).HasMaxLength(250);
            builder.Property(x => x.BranchName).IsRequired(false).HasMaxLength(250);
            builder.Property(x => x.Ifsc).IsRequired(false).HasMaxLength(20);
            builder.Property(x => x.Status).IsRequired();
            builder.Property(x => x.CreatedOn).IsRequired();
            builder.Property(x => x.CreatedBy).IsRequired().HasMaxLength(40);
            builder.Property(x => x.UpdatedOn).IsRequired(false);
            builder.Property(x => x.UpdatedBy).HasMaxLength(40);
            builder.Property(x => x.COA_AccountTypeId).IsRequired(false);
            builder.Property(x => x.AccountCode).IsRequired(false);
            builder.Property(x => x.Description).HasMaxLength(250).IsRequired(false);
            builder.Property(x => x.LedgerType).IsRequired(false);
            builder.Property(x => x.AccountName).IsRequired(false);
            builder.Property(x => x.AccountId).IsRequired(false);

            builder.HasMany(x => x.Transaction).WithOne().HasForeignKey(x => x.BankAccountId);

        }
    }
}
