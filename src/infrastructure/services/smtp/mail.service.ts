import { MailerService } from "@nestjs-modules/mailer";
import { HttpException, Injectable } from "@nestjs/common";
import  ISendMail, { MailParameter }  from "src/application/ports/sendMail.ports";

@Injectable()
class SendMailNodeMailerService implements ISendMail {
    constructor(private readonly mailService: MailerService) {}

    public async sendMail(mailParameter: MailParameter): Promise<void> {
        try {
            await this.mailService.sendMail({
                from: process.env.FROM,
                to: mailParameter.to,
                subject: mailParameter.subject,
                text: mailParameter.text,
                html: mailParameter.html,
                cc: mailParameter.cc,
                bcc: mailParameter.bcc,
                attachments: mailParameter.attachments
            })
        } catch(error) {
            throw new HttpException(`Impossible d’envoyer le mail: ${error.message}`, 500);
        }
    }
}

export default SendMailNodeMailerService;