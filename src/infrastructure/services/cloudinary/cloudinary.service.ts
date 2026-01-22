import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
    constructor(private readonly config: ConfigService) {
        cloudinary.config({
        cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
        api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
        api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadFiles(files: Express.Multer.File[], folder = 'emails') {
        if (!files || files.length == 0) throw new BadRequestException('Aucun fichier reçu');

        try {
            const uploads = files.map(
            (file) =>
                new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ folder }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                    })
                    .end(file.buffer);
                }),
            );

            const results = await Promise.all(uploads);
            
            return results;
        } catch (error) {
            throw new BadRequestException(`Erreur Cloudinary: ${error.message}`);
        }
    }
}
