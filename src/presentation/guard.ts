import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard extends AuthGuard('none') {
  constructor(private configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key missing');
    }

    const validKey = this.configService.get<string>('EXTERNAL_SERVICE_API_KEY');

    if (!validKey) {
      throw new Error('EXTERNAL_SERVICE_API_KEY not configured');
    }

    if (apiKey !== validKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
