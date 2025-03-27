import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prsima.service'; // Fixed import path
import { UpdateMedicalDataDto } from './dto/update-medicat-data.dto'; // Fixed filename
import { CreateMedicalRecordDto } from './dto/craete-medical-record.dto'; // Fixed filename

@Injectable()
export class MedicalDataService {
  constructor(private prisma: PrismaService) {}

  async updateMedicalData(userId: string, updateMedicalDataDto: UpdateMedicalDataDto) {
    // Check if user is a patient
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { patient: true },
    });

    if (!user || user.role !== 'PATIENT' || !user.patient) {
      throw new ForbiddenException('Only patients can update their medical data');
    }

    // Format data properly for storage
    const dataToUpdate = {
      ...updateMedicalDataDto,
      allergies: updateMedicalDataDto.allergies ? JSON.stringify(updateMedicalDataDto.allergies) : undefined,
      chronicConditions: updateMedicalDataDto.chronicConditions 
        ? JSON.stringify(updateMedicalDataDto.chronicConditions) 
        : undefined,
      currentMedications: updateMedicalDataDto.currentMedications 
        ? JSON.stringify(updateMedicalDataDto.currentMedications) 
        : undefined,
    };

    // Check if medical data exists for this patient
    const medicalData = await this.prisma.medicalData.findUnique({
      where: { patientId: user.patient.id },
    });

    if (medicalData) {
      // Update existing record
      const updatedMedicalData = await this.prisma.medicalData.update({
        where: { id: medicalData.id },
        data: dataToUpdate,
      });
      return this.formatMedicalDataResponse(updatedMedicalData);
    } else {
      // Create new record
      const newMedicalData = await this.prisma.medicalData.create({
        data: {
          patientId: user.patient.id,
          ...dataToUpdate,
        },
      });
      return this.formatMedicalDataResponse(newMedicalData);
    }
  }

  async getMedicalData(userId: string, patientId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { patient: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let targetPatientId: string;

    // If user is a patient, they can only access their own data
    if (user.role === 'PATIENT') {
      if (!user.patient) {
        throw new BadRequestException('User is not associated with a patient profile');
      }
      
      if (patientId && user.patient.id !== patientId) {
        throw new ForbiddenException('You can only access your own medical data');
      }
      targetPatientId = user.patient.id;
    } 
    // If user is a caretaker, they must provide a patientId
    else if (user.role === 'CARETAKER') {
      if (!patientId) {
        throw new BadRequestException('Patient ID is required');
      }
      targetPatientId = patientId;
    } else {
      throw new ForbiddenException('Unauthorized');
    }

    const medicalData = await this.prisma.medicalData.findUnique({
      where: { patientId: targetPatientId },
      include: { medicalRecords: true },
    });

    if (!medicalData) {
      throw new NotFoundException('Medical data not found');
    }

    return this.formatMedicalDataResponse(medicalData);
  }

  async addMedicalRecord(userId: string, patientId: string, createMedicalRecordDto: CreateMedicalRecordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { patient: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate access permissions
    if (user.role === 'PATIENT' && user.patient?.id !== patientId) {
      throw new ForbiddenException('You can only add medical records to your own profile');
    }

    // Get the medical data ID for the patient
    const medicalData = await this.prisma.medicalData.findUnique({
      where: { patientId },
    });

    if (!medicalData) {
      throw new NotFoundException('Medical data not found for this patient');
    }

    // Create new medical record
    const newRecord = await this.prisma.medicalRecord.create({
      data: {
        medicalDataId: medicalData.id,
        ...createMedicalRecordDto,
        date: new Date(createMedicalRecordDto.date),
      },
    });

    return newRecord;
  }

  private formatMedicalDataResponse(medicalData) {
    // Parse JSON stored fields back to objects/arrays
    return {
      ...medicalData,
      allergies: medicalData.allergies ? JSON.parse(medicalData.allergies) : [],
      chronicConditions: medicalData.chronicConditions ? JSON.parse(medicalData.chronicConditions) : [],
      currentMedications: medicalData.currentMedications ? JSON.parse(medicalData.currentMedications) : [],
    };
  }
}