import {
  IsString,
  IsEmail,
  Length,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import {
  password_lenght,
  password_regex,
} from '../../constants/password.constant';
import {
  nameLength,
  nameRegex as name_regex,
} from '../../constants/user.constant';

export class CreateUserRequest {
  @IsNotEmpty({ message: 'Você precisa preencher o campo name' })
  @IsString({ message: 'O campo name deve ser do tipo string' })
  @Length(nameLength.min, nameLength.max, {
    message: `O campo name deve ter entre ${nameLength.min} e ${nameLength.max} caracteres`,
  })
  @Matches(name_regex, {
    message: 'O campo nome deve ter apenas caracteres alpha numericos',
  })
  name: string;

  @IsEmail({}, { message: 'Email invalido' })
  email: string;

  @IsNotEmpty({ message: 'Você precisa preencher o campo password' })
  @IsString({ message: 'O campo password deve ser do tipo string' })
  @Length(password_lenght.min, password_lenght.max, {
    message: `O campo password deve ter entre ${password_lenght.min} e ${password_lenght.max} caracteres`,
  })
  @Matches(password_regex, {
    message:
      'O campo password deve conter ao menos 1 numero, 1 letra minuscula, 1 letra maiuscula, 1 caracter especial',
  })
  password: string;
}
