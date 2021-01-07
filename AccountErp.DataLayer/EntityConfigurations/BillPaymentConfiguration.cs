using AccountErp.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AccountErp.DataLayer.EntityConfigurations
{
    public class BillPaymentConfiguration : IEntityTypeConfiguration<BillPayment>
    {
        public void Configure(EntityTypeBuilder<BillPayment> builder)
        {
            builder.ToTable("BillPayments");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            builder.Property(x => x.BillId).IsRequired();
            builder.Property(x => x.PaymentMode).IsRequired();
            builder.Property(x => x.BankAccountId).IsRequired(false);
            builder.Property(x => x.CreditCardId).IsRequired(false);
            builder.Property(x => x.DepositTo).IsRequired(false).HasMaxLength(50);
            builder.Property(x => x.Amount).IsRequired().HasColumnType("NUMERIC(12,2)");
            builder.Property(x => x.PaymentDate).IsRequired(false);
            builder.Property(x => x.ChequeNumber).IsRequired(false);
            builder.Property(x => x.Status).IsRequired();
            builder.Property(x => x.CreatedOn).IsRequired();
            builder.Property(x => x.CreatedBy).IsRequired().HasMaxLength(40);
            builder.Property(x => x.UpdatedOn).IsRequired(false);
            builder.Property(x => x.UpdatedBy).HasMaxLength(40);
        }
    }
}
