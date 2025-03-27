import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import { PrismaService } from '../../prisma/prsima.service';
  import { RegisterDto } from './dto/register.dto';
  import { LoginDto } from './dto/login.dto';
  
  @Injectable()
  export class AuthService {
    constructor(
      private prisma: PrismaService,
      private jwtService: JwtService,
    ) {}
  
    async register(registerDto: RegisterDto) {
        const { email, password, role, name, phoneNumber, address } = registerDto;
        
        // Check if user exists
        const userExists = await this.prisma.user.findUnique({
          where: { email },
        });
      
        if (userExists) {
          throw new BadRequestException('User already exists');
        }
      
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
      
        // Create user with role-specific data
        const user = await this.prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role,
          },
        });
      
        if (role === 'PATIENT') {
          if (!address) {
            throw new BadRequestException('Address is required for patients');
          }
          
          await this.prisma.patient.create({
            data: {
              name,
              phoneNumber,
              address, // Now we know address exists if it's a patient
              userId: user.id,
            },
          });
        } else if (role === 'CARETAKER') {
          await this.prisma.caretaker.create({
            data: {
              name,
              phoneNumber,
              userId: user.id,
            },
          });
        }
      
        return this.generateToken(user.id, user.email, user.role);
      }
  
    async login(loginDto: LoginDto) {
      const { email, password } = loginDto;
      
      // Find user
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      return this.generateToken(user.id, user.email, user.role);
    }
  
    async getUserProfile(userId: string) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          patient: true,
          caretaker: true,
        },
      });
  
      if (!user) {
        throw new BadRequestException('User not found');
      }
  
      return user;
    }
  
    private generateToken(userId: string, email: string, role: string) {
      const payload = { sub: userId, email, role };
      
      return {
        accessToken: this.jwtService.sign(payload),
        user: { id: userId, email, role },
      };
    }
  }