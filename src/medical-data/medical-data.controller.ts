import { Controller, Get, Post, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { MedicalDataService } from './medical-data.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { UpdateMedicalDataDto } from './dto/update-medicat-data.dto';
import { CreateMedicalRecordDto } from './dto/craete-medical-record.dto';

@Controller('medical-data')
@UseGuards(JwtAuthGuard)
export class MedicalDataController {
  constructor(private readonly medicalDataService: MedicalDataService) {}

  @Post('update')
  updateMedicalData(
    @Request() req,
    @Body() updateMedicalDataDto: UpdateMedicalDataDto,
  ) {
    return this.medicalDataService.updateMedicalData(
      req.user.sub,
      updateMedicalDataDto,
    );
  }

  @Get()
  getOwnMedicalData(@Request() req) {
    return this.medicalDataService.getMedicalData(req.user.sub);
  }

  @UseGuards(RolesGuard)
  @Roles('CARETAKER')
  @Get('patient/:patientId')
  getPatientMedicalData(
    @Request() req,
    @Param('patientId') patientId: string,
  ) {
    return this.medicalDataService.getMedicalData(req.user.sub, patientId);
  }

  @Post('records/:patientId')
  addMedicalRecord(
    @Request() req,
    @Param('patientId') patientId: string,
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
  ) {
    return this.medicalDataService.addMedicalRecord(
      req.user.sub,
      patientId,
      createMedicalRecordDto,
    );
  }
}