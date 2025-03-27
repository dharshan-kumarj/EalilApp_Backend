import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
    Param,
    Query,
    ParseIntPipe,
    DefaultValuePipe,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
  import { RolesGuard } from '../auth/guard/roles.guard';
  import { Roles } from '../auth/guard/roles.decorator';
  import { LocationsService } from './locations.service';
  import { UpdateLocationDto } from './dto/updated-locations.dto';
  
  @Controller('locations')
  export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}
  
    @UseGuards(JwtAuthGuard)
    @Post('update')
    updateLocation(
      @Request() req,
      @Body() updateLocationDto: UpdateLocationDto,
    ) {
      return this.locationsService.updateLocation(req.user.sub, updateLocationDto);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CARETAKER')
    @Get('patient/:patientId')
    getPatientLocation(@Param('patientId') patientId: string) {
      return this.locationsService.getPatientLocation(patientId);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CARETAKER', 'PATIENT')
    @Get('history/:patientId')
    getLocationHistory(
      @Param('patientId') patientId: string,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
      return this.locationsService.getLocationHistory(patientId, limit);
    }
  }