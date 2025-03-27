import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateMedicalRecordDto {
  @IsNotEmpty()
  @IsString()
  recordType: string;
  
  @IsNotEmpty()
  @IsDateString()
  date: string;
  
  @IsOptional()
  @IsString()
  doctorName?: string;
  
  @IsOptional()
  @IsString()
  diagnosis?: string;
  
  @IsOptional()
  @IsString()
  prescription?: string;
  
  @IsOptional()
  @IsString()
  notes?: string;
  
  @IsOptional()
  @IsString()
  attachmentUrl?: string;
}