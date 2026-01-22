import { BadRequestException, Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { SendEmailDto } from "./dto/sendMail.dto";
import SendMailService from "src/application/use-cases/sendMail.usecase";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { Result } from "./dto/response.dto";
import Constante from "src/constante";
import { ApiKeyGuard } from "./guard";

@Controller('mail')
@ApiTags('Mail')
class MailController {
    constructor(private readonly sendMailService: SendMailService) {}

    @Post()
    @UseGuards(ApiKeyGuard)
    @ApiSecurity('apiKey')
    @ApiOperation({ 
        summary: 'Envoyer des emails avec ou sans pièces jointes',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: "Il s'agit du champ pour ajouter les fichiers",
        required: true,
        schema: {
            type: 'object',
            required: ["to", "subject"],
            properties: {
                to: {
                    type: "string",
                    format: "email",
                    description: "Le destinataire"
                },
                subject: {
                    type: "string",
                    description: "Le sujet de l'email",
                    example: "Reset Email"
                },
                cc: {
                    type: "array",
                    items: { type: "string", format: "email" },
                    description: "Le(s) destinataire(s) qui sont mis en copie"
                },
                bcc: {
                    type: "array",
                    items: { type: "string", format: "email" },
                    description: "Le(s) destinataire(s) qui sont mis en copie mais ne sont pas vu"
                },
                text: {
                    type: "string",
                    description: "Le contenu de l'email si c'est du texte brut (requis si html non utilisé)",
                    example: ""
                },
                html: {
                    type: "string",
                    description: "Le contenu de l'email si c'est du html (requis si text non utilisé)",
                    example: ""
                },
                files: { 
                    type: 'array', 
                    items: { type: 'string', format: 'binary' },
                    description: 'Plusieurs fichiers (maximum 10 fichiers de taille maximum 5MB)'
                }
            }
        }
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Envoi de mail avec succès',
        schema: {
            example: {
                success: true,
                message: "Mail sent with success",
                data: null
            }
        }
    })
    @UseInterceptors(FilesInterceptor('files', Constante.MAXIMUM_NUMBER_FILE, {
        fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
            return cb(new BadRequestException('Fichier non autorisé'), false);
        }
        cb(null, true);
    }}))
    async sendMailWithAttachments(@Body() sendMailDto: SendEmailDto, @UploadedFiles() files: Express.Multer.File[]): Promise<Result> {
        await this.sendMailService.sendMail(sendMailDto, files);
        return new Result(true, "Mail sent with success", null);
    }
}

export default MailController;