import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordResponseDto {
  @ApiProperty({
    type: Boolean,
    required: true,
  })
  result: boolean;
}
