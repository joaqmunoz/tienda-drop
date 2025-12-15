"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        frameguard: { action: 'deny' },
        noSniff: true,
        xssFilter: true,
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }));
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Demasiadas solicitudes desde esta IP, intenta más tarde.'
    });
    const authLimiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 5,
        message: 'Demasiados intentos de inicio de sesión, intenta más tarde.'
    });
    app.use(limiter);
    app.use('/auth/login', authLimiter);
    app.use('/auth/register', authLimiter);
    app.use((0, express_mongo_sanitize_1.default)({
        replaceWith: '_',
        onSanitize: ({ key }) => {
            console.warn(`⚠️ Sanitización detectada en ${key}`);
        },
    }));
    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                process.env.FRONTEND_URL || 'http://localhost:3000',
                'http://localhost:3000',
                'http://127.0.0.1:3000',
            ];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('CORS no permitido'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        maxAge: 3600,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
            const messages = errors.map(error => ({
                field: error.property,
                message: Object.values(error.constraints || {}).join(', '),
            }));
            return new common_1.BadRequestException({
                statusCode: 400,
                message: 'Validación fallida',
                errors: messages,
            });
        },
    }));
    app.use((_req, res, next) => {
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        next();
    });
    app.use((_req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            const logLevel = res.statusCode >= 400 ? '⚠️' : '✓';
            console.log(`${logLevel} ${_req.method} ${_req.path} - ${res.statusCode} (${duration}ms) - IP: ${_req.ip}`);
        });
        next();
    });
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  🚀 SERVIDOR SEGURO INICIADO                              ║
║  Puerto: ${port}                                              ║
║  Ambiente: ${process.env.NODE_ENV || 'development'}                              ║
║  Seguridad: ✓ Helmet.js                                   ║
║  Seguridad: ✓ Rate Limiting                               ║
║  Seguridad: ✓ CORS Validado                               ║
║  Seguridad: ✓ Sanitización de Datos                       ║
║  Seguridad: ✓ Headers HTTP Seguros                        ║
╚════════════════════════════════════════════════════════════╝
  `);
}
bootstrap().catch((err) => {
    console.error('❌ Error al iniciar servidor:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map