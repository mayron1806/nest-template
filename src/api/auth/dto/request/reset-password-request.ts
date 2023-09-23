import { IsEmail, IsOptional, Length, Matches } from 'class-validator';
import {
  password_lenght,
  password_regex,
} from '../../constants/password.constant';

export class ResetPasswordRequest {
  @IsOptional()
  @IsEmail({}, { message: 'Email invalido' })
  email?: string;

  @IsOptional()
  @Length(password_lenght.min, password_lenght.max, {
    message: `O campo password deve ter entre ${password_lenght.min} e ${password_lenght.max} caracteres`,
  })
  @Matches(password_regex, {
    message:
      'O campo password deve conter ao menos 1 numero, 1 letra minuscula, 1 letra maiuscula, 1 caracter especial',
  })
  password?: string;

  @IsOptional()
  @Length(password_lenght.min, password_lenght.max, {
    message: `O campo password deve ter entre ${password_lenght.min} e ${password_lenght.max} caracteres`,
  })
  @Matches(password_regex, {
    message:
      'O campo password deve conter ao menos 1 numero, 1 letra minuscula, 1 letra maiuscula, 1 caracter especial',
  })
  confirmPassword?: string;

  type: 'sendEmail' | 'resetPassword';
}
