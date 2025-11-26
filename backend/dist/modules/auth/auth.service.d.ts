import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '@/entities';
import { RegisterDto, LoginDto } from '@/common/dtos/auth.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
            isAdmin: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            orders: import("@/entities").Order[];
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
            isAdmin: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            orders: import("@/entities").Order[];
        };
    }>;
    validateUser(userId: string): Promise<User>;
    private generateToken;
    private sanitizeUser;
}
//# sourceMappingURL=auth.service.d.ts.map