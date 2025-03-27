import { Module } from '@nestjs/common';
import { MedicalDataService } from './medical-data.service';
import { MedicalDataController } from './medical-data.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MedicalDataController],
  providers: [MedicalDataService],
})
export class MedicalDataModule {}