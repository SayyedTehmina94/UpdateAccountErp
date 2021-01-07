using AccountErp.Infrastructure.Managers;
using AccountErp.Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AccountErp.Managers
{
    public class EmailManager : IEmailManager
    {
        private readonly IEmailService _emailService;

        public EmailManager(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public async Task SendInvoiceAsync(string email,string attachmentPath)
        {
            await _emailService.SendWithAttachmentAsync(email , "Invoice","test" , attachmentPath);
        }
    }
}
