import { ApiProperty } from '@nestjs/swagger';

export class MovieResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  release: number;

  @ApiProperty()
  createdAt: Date;
}
