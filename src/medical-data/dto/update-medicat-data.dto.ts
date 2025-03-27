import { IsOptional, IsString, IsNumber, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMedicalDataDto {
  @IsOptional()
  @IsString()
  bloodType?: string;
  
  @IsOptional()
  @IsNumber()
  height?: number;
  
  @IsOptional()
  @IsNumber()
  weight?: number;
  
  @IsOptional()
  @IsArray()
  allergies?: string[];
  
  @IsOptional()
  @IsArray()
  chronicConditions?: string[];
  
  @IsOptional()
  @IsArray()
  currentMedications?: {
    name: string;
    dosage: string;
    frequency: string;
    purpose?: string;
  }[];
  
  @IsOptional()
  @IsString()
  emergencyContactName?: string;
  
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;
  
  @IsOptional()
  @IsString()
  emergencyContactRelation?: string;
  
  @IsOptional()
  @IsString()
  notes?: string;
}