import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(['PATIENT', 'CARETAKER'], { message: 'Role must be either PATIENT or CARETAKER' })
  role: 'PATIENT' | 'CARETAKER';

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ValidateIf(o => o.role === 'PATIENT')
  @IsNotEmpty({ message: 'Address is required for patients' })
  @IsString()
  address?: string;
}