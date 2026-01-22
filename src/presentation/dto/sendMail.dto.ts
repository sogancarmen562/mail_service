import { ArrayMaxSize, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, registerDecorator, ValidateIf, ValidationOptions, ValidationArguments } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class SendEmailDto
{
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    to: string;

    @Transform(({ value }) => parseMultipartArray(value))
    @IsOptional()
    @IsEmail({}, { each: true })
    @IsArray()
    @ArrayMaxSize(20)
    @ApiProperty({required: false})
    cc?: string[];

    @Transform(({ value }) => parseMultipartArray(value))
    @IsOptional()
    @IsEmail({}, { each: true })
    @IsArray()
    @ArrayMaxSize(20)
    @ApiProperty({required: false})
    bcc?: string[];

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(200)
    @ApiProperty()
    subject: string;

    @RequireTextOrHtml({ message: 'Vous devez fournir soit "text" soit "html"',})
    @ValidateIf(o => !o.html)
    @IsString()
    @MaxLength(10000)
    @ApiProperty({description: "Le contenu de l'email s'il s'agit de texte brut (requis si html n'est pas utiliser)",})
    text?: string;

    @RequireTextOrHtml({ message: 'Vous devez fournir soit "text" soit "html"',})
    @ValidateIf(o => !o.text)
    @IsString()
    @MaxLength(50000)
    @ApiProperty({description: "Le contenu de l'email s'il s'agit du Html (requis si text n'est pas utiliser)"})
    html?: string;

    @IsOptional()
    files: attachmentsType[]
}

function RequireTextOrHtml(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'requireTextOrHtml',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj = args.object as any;
          return !!(obj.text || obj.html);
        },
      },
    });
  };
}

function parseMultipartArray(value: any): string[] {
  if (Array.isArray(value)) return value;

  if (typeof value === 'string') {
    const v = value.trim();

    if (!v) return [];

    if(value.includes(",")) return value.split(",");

    return [v];
  }

  return [];
}

export interface attachmentsType {
  filename: string,
  path: string
}