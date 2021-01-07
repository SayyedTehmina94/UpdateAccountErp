using AccountErp.Entities;
using AccountErp.Models.RecurringInvoice;
using AccountErp.Utilities;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AccountErp.Factories
{
    public class RecurringInvoiceFactory
    {
        public static RecurringInvoice Create(RecInvoiceAddModel model, string userId, int count)
        {
            var recInvoice = new RecurringInvoice
            {
                CustomerId = model.CustomerId,
                RecInvoiceNumber = "REC-INV" + "-" + model.RecInvoiceDate.ToString("yy") + "-" + (count + 1).ToString("000"),
                Tax = model.Tax,
                Discount = model.Discount,
                TotalAmount = model.TotalAmount,
                Remark = model.Remark,
                Status = Constants.InvoiceStatus.Pending,
                CreatedBy = userId ?? "0",
                CreatedOn = Utility.GetDateTime(),
                RecInvoiceDate = model.RecInvoiceDate,
                StrRecInvoiceDate = model.RecInvoiceDate.ToString("yyyy-MM-dd"),
                RecDueDate = model.RecDueDate,
                StrRecDueDate = model.RecDueDate.ToString("yyyy-MM-dd"),
                PoSoNumber = model.PoSoNumber,
                SubTotal =model.SubTotal,
                LineAmountSubTotal = model.LineAmountSubTotal,
                Services = model.Items.Select(x => new RecurringInvoiceService
                {
                    Id = Guid.NewGuid(),
                    ServiceId = x.ServiceId,
                    Rate = x.Rate,
                    Quantity = x.Quantity,
                    Price = x.Price,
                    TaxId = x.TaxId,
                    TaxPercentage = x.TaxPercentage,
                    LineAmount = x.LineAmount,
                    TaxPrice = x.TaxPrice
                }).ToList()
            };


            if (model.Attachments == null || !model.Attachments.Any())
            {
                return recInvoice;
            }

            foreach (var attachment in model.Attachments)
            {
                recInvoice.Attachments = new List<RecurringInvoiceAttachment>
                {
                    new RecurringInvoiceAttachment
                    {
                        Title = attachment.Title,
                        FileName = attachment.FileName,
                        OriginalFileName = attachment.OriginalFileName,
                        CreatedBy =userId ?? "0",
                        CreatedOn =Utility.GetDateTime()
                    }
                };
            }

            return recInvoice;
        }

        public static void EditInvoice(RecInvoiceEditModel model, RecurringInvoice entity, string userId)
        {
            entity.CustomerId = model.CustomerId;
            entity.Tax = model.Tax;
            entity.Discount = model.Discount;
            entity.TotalAmount = model.TotalAmount;
            entity.Remark = model.Remark;
            entity.UpdatedBy = userId ?? "0";
            entity.UpdatedOn = Utility.GetDateTime();
            entity.RecInvoiceDate = model.RecInvoiceDate;
            entity.StrRecInvoiceDate = model.RecInvoiceDate.ToString("yyyy-MM-dd");
            entity.RecDueDate = model.RecDueDate;
            entity.StrRecDueDate = model.RecDueDate.ToString("yyyy-MM-dd");
            entity.PoSoNumber = model.PoSoNumber;
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
                entity.Services.Add(new RecurringInvoiceService
                {
                    Id = Guid.NewGuid(),
                    ServiceId = service.ServiceId,
                    Rate = service.Rate,
                    TaxId = service.TaxId,
                    Price = service.Price,
                    Quantity = service.Quantity,
                    TaxPercentage = service.TaxPercentage,
                    TaxPrice = service.TaxPrice
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
                var recInvoiceAttachment = entity.Attachments.SingleOrDefault(x => x.FileName.Equals(attachment.FileName));

                if (recInvoiceAttachment == null)
                {
                    recInvoiceAttachment = new RecurringInvoiceAttachment
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
                    recInvoiceAttachment.Title = attachment.Title;
                    recInvoiceAttachment.FileName = attachment.FileName;
                    recInvoiceAttachment.OriginalFileName = attachment.OriginalFileName;
                }

                entity.Attachments.Add(recInvoiceAttachment);
            }
        }
    }
}
