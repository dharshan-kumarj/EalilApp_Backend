import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateLocationDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsOptional()
  @IsNumber()
  accuracy?: number;
}