import { Injectable } from "@nestjs/common";
import { CloudinaryService } from "src/infrastructure/services/cloudinary/cloudinary.service";
import SendMailNodeMailerService from "src/infrastructure/services/smtp/mail.service";
import { SendEmailDto } from "src/presentation/dto/sendMail.dto";

@Injectable()
class SendMailService {
    constructor(private readonly sendMailNodeMailerService: SendMailNodeMailerService, private readonly cloudinaryService: CloudinaryService) {}

    public async sendMail(sendMailDto: SendEmailDto, files?: Express.Multer.File[]): Promise<void> {
        if(!files) await this.sendMailNodeMailerService.sendMail(sendMailDto);
        
        else {
            let attachments;
            if(files.length){ 
                const uploadResults: any = await this.cloudinaryService.uploadFiles(files);
                attachments = uploadResults.map((result, index) => ({
                    filename: files[index].originalname,
                    path: result.secure_url,
                }));
            }
            await this.sendMailNodeMailerService.sendMail({...sendMailDto, attachments});
        }
    }
}

export default SendMailService;