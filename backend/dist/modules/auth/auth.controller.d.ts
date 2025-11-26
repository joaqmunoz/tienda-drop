import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '@/common/dtos/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
            orders: import("../../entities").Order[];
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
            orders: import("../../entities").Order[];
        };
    }>;
    getProfile(req: any): Promise<any>;
    logout(): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=auth.controller.d.ts.map