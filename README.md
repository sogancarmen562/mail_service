## Description

Il s'agit d'une api qui permet à tous développeur de faire des requêtes directement plutôt que de reconfigurer l'envoie de mail encore et encore. Ceci est entièrement gratuit.

## Project setup

```bash
$ pnpm install
```

## Contents of .env.example
```bash
PORT=votre_port
EMAIL_HOST=smtp.gmail.com
EMAIL_USERNAME=username_email
EMAIL_PASSWORD=mot_de_passe_application
FROM=Appplication <johndoe@gmail.com>

CLOUDINARY_CLOUD_NAME=cloudinary_name
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_API_SECRET=cloudinary_api_secret
CLOUDINARY_URL=cloudinary_url
CORS_ORIGINS=cors_origin
EXTERNAL_SERVICE_API_KEY=api_key
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Stay in touch

- Author - [SOGAN Carmen]([https://twitter.com/kammysliwiec](https://www.linkedin.com/in/carmen-sogan-6b4a54266/))

## License

[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
