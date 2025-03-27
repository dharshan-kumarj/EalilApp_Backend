import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { LocationsModule } from './locations/locations.module';
import { MedicalDataModule } from './medical-data/medical-data.module'; // Import the new module

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    LocationsModule,
    MedicalDataModule, // Add the new module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}