import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prsima.service';
import { UpdateLocationDto } from './dto/updated-locations.dto';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async updateLocation(userId: string, updateLocationDto: UpdateLocationDto) {
    // Check if the user is a patient
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { patient: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'PATIENT' || !user.patient) {
      throw new ForbiddenException('Only patients can update their location');
    }

    const { latitude, longitude } = updateLocationDto;
    const now = new Date();

    // Update patient's current location
    await this.prisma.patient.update({
      where: { id: user.patient.id },
      data: {
        latitude,
        longitude,
        lastLocationUpdate: now,
      },
    });

    // Record location history
    const locationHistory = await this.prisma.locationHistory.create({
      data: {
        patientId: user.patient.id,
        latitude,
        longitude,
        timestamp: now,
      },
    });

    return {
      success: true,
      message: 'Location updated successfully',
      timestamp: now,
      location: {
        latitude,
        longitude,
      },
    };
  }

  async getPatientLocation(patientId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        lastLocationUpdate: true,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async getLocationHistory(patientId: string, limit = 10) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const locationHistory = await this.prisma.locationHistory.findMany({
      where: { patientId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return locationHistory;
  }
}