import { ApiProperty } from '@nestjs/swagger';

export class ActiveUserResponseDto {
  @ApiProperty({
    type: Boolean,
    required: true,
  })
  result: boolean;
}
