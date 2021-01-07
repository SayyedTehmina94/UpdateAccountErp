using AccountErp.Entities;
using AccountErp.Models.Quotation;
using AccountErp.Utilities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Collections;

namespace AccountErp.Factories
{
    public class QuotationFactory
    {
        public static Quotation Create(QuotationAddModel model, string userId,int count)
        {

            var quotation = new Quotation
            {
                CustomerId = model.CustomerId,
                QuotationNumber = "QUO" + "-" + model.QuotationDate.ToString("yy") + "-" + (count + 1).ToString("000"),
                Tax = model.Tax,
                Discount = model.Discount,
                TotalAmount = model.TotalAmount,
                Remark = model.Remark,
                Status = Constants.InvoiceStatus.Pending,
                CreatedBy = userId ?? "0",
                CreatedOn = Utility.GetDateTime(),
                QuotationDate = model.QuotationDate,
                StrQuotationDate = model.QuotationDate.ToString("yyyy-MM-dd"),
                ExpireDate = model.ExpiryDate,
                StrExpireDate = model.ExpiryDate.ToString("yyyy-MM-dd"),
                PoSoNumber = model.PoSoNumber,
                Memo = model.Memo,
                SubTotal = model.SubTotal,
                LineAmountSubTotal = model.LineAmountSubTotal,
                Services = model.Items.Select(x => new QuotationService
                {
                    Id = Guid.NewGuid(),
                    ServiceId = x.ServiceId,
                    Rate = x.Rate,
                    Quantity = x.Quantity,
                    Price = x.Price,
                    TaxId = x.TaxId,
                    TaxPrice = x.TaxPrice,
                    TaxPercentage = x.TaxPercentage,
                    LineAmount = x.LineAmount
                }).ToList()
            };


            if (model.Attachments == null || !model.Attachments.Any())
            {
                return quotation;
            }

            quotation.Attachments = model.Attachments.Select(x => new QuotationAttachment
            {
                Title = x.Title,
                FileName = x.FileName,
                OriginalFileName = x.OriginalFileName,
                CreatedBy = userId ?? "0",
                CreatedOn = Utility.GetDateTime()
            }).ToList();

            return quotation;
        }

        public static void EditInvoice(QuotationEditModel model, Quotation entity, string userId)
        {
            entity.CustomerId = model.CustomerId;
            entity.Tax = model.Tax;
            entity.Discount = model.Discount;
            entity.TotalAmount = model.TotalAmount;
            entity.Remark = model.Remark;
            entity.UpdatedBy = userId ?? "0";
            entity.UpdatedOn = Utility.GetDateTime();
            entity.QuotationDate = model.QuotationDate;
            entity.StrQuotationDate = model.QuotationDate.ToString("yyyy-MM-dd");
            entity.ExpireDate = model.ExpiryDate;
            entity.StrExpireDate = model.ExpiryDate.ToString("yyyy-MM-dd");
            entity.PoSoNumber = model.PoSoNumber;
            entity.Memo = model.Memo;
            entity.SubTotal = model.SubTotal;
            entity.LineAmountSubTotal = model.LineAmountSubTotal;

            //int[] arr = new int[100];
            ArrayList tempArr = new ArrayList();

            //for (int i=0;i<model.Items.Count; i++)
            //{
            //    arr[i] = model.Items[i].ServiceId;
            //}

            foreach (var item in model.Items)
            {
                tempArr.Add(item.ServiceId);
                var alreadyExistServices = entity.Services.Where(x => item.ServiceId == x.ServiceId).FirstOrDefault();
                //entity.Services.Where(x => item.ServiceId == x.ServiceId).Select(c => { c.CreditLimit = 1000; return c; });
                if (alreadyExistServices != null)
                {
                    alreadyExistServices.Price = item.Price;
                    alreadyExistServices.TaxId = item.TaxId;
                    alreadyExistServices.TaxPercentage = item.TaxPercentage;
                    alreadyExistServices.Rate = item.Rate;
                    alreadyExistServices.Quantity = item.Quantity;
                    alreadyExistServices.TaxPrice = item.TaxPrice;
                    alreadyExistServices.LineAmount = item.LineAmount;
                    entity.Services.Add(alreadyExistServices);
                }
            }

            var deletedServices = entity.Services.Where(x => !tempArr.Contains(x.ServiceId)).ToList();
            //var resultAll = items.Where(i => filter.All(x => i.Features.Any(f => x == f.Id)));

            foreach (var deletedService in deletedServices)
            {
                entity.Services.Remove(deletedService);
            }

            var addedServices = model.Items
                .Where(x => !entity.Services.Select(y => y.ServiceId).Contains(x.ServiceId))
                .ToList();

            foreach (var service in addedServices)
            {
                entity.Services.Add(new QuotationService
                {
                    Id = Guid.NewGuid(),
                    ServiceId = service.ServiceId,
                    Rate = service.Rate,
                    TaxId = service.TaxId,
                    Price = service.Price,
                    TaxPrice = service.TaxPrice,
                    Quantity = service.Quantity,
                    TaxPercentage = service.TaxPercentage,
                    LineAmount = service.LineAmount
                });
            }

            if (model.Attachments == null || !model.Attachments.Any())
            {
                return;
            }

            var deletedAttachemntFiles = entity.Attachments.Select(x => x.FileName)
                .Except(model.Attachments.Select(y => y.FileName)).ToList();

            foreach (var deletedAttachemntFile in deletedAttachemntFiles)
            {
                var attachemnt = entity.Attachments.Single(x => x.FileName.Equals(deletedAttachemntFile));
                entity.Attachments.Remove(attachemnt);
            }

            foreach (var attachment in model.Attachments)
            {
                var invoiceAttachment = entity.Attachments.SingleOrDefault(x => x.FileName.Equals(attachment.FileName));

                if (invoiceAttachment == null)
                {
                    invoiceAttachment = new QuotationAttachment
                    {
                        Title = attachment.Title,
                        FileName = attachment.FileName,
                        OriginalFileName = attachment.OriginalFileName,
                        CreatedBy = userId ?? "0",
                        CreatedOn = Utility.GetDateTime()
                    };
                }
                else
                {
                    invoiceAttachment.Title = attachment.Title;
                    invoiceAttachment.FileName = attachment.FileName;
                    invoiceAttachment.OriginalFileName = attachment.OriginalFileName;
                }

                entity.Attachments.Add(invoiceAttachment);
            }
        }
    }
}
