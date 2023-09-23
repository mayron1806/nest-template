import { IsNotEmpty } from 'class-validator';

export class RefreshTokenRequest {
  @IsNotEmpty({ message: 'Você precisa preencher o campo accessToken' })
  accessToken: string;

  @IsNotEmpty({ message: 'Você precisa preencher o campo refreshToken' })
  refreshToken: string;
}
