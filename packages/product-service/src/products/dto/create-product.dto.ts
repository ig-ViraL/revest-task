import { IsString, IsNumber, IsOptional, IsPositive, Min, MaxLength, Matches } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  @MaxLength(2_000_000)
  @Matches(/^(https?:\/\/|data:image\/(png|jpe?g|webp|gif);base64,)/, {
    message: 'imageUrl must be an http(s) URL or a valid base64 image data URI',
  })
  imageUrl?: string;
}
