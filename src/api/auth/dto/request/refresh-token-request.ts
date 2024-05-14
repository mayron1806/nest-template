import { IsNotEmpty } from 'class-validator';

export class RefreshTokenRequest {
  @IsNotEmpty({ message: 'Você precisa preencher o campo refreshToken' })
  refreshToken: string;
}
