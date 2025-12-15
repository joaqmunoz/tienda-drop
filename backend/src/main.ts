import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ============================================
  // 🔒 SEGURIDAD DE NIVEL EMPRESARIAL
  // ============================================

  // 1. Helmet.js - Headers de seguridad HTTP
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 año
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }));

  // 2. Rate Limiting - Protección contra DDoS y fuerza bruta
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 solicitudes por ventana
    message: 'Demasiadas solicitudes desde esta IP, intenta más tarde.'
  });

  // Rate limiting más estricto para autenticación
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo 5 intentos de login
    message: 'Demasiados intentos de inicio de sesión, intenta más tarde.'
  });

  // Aplicar middlewares de rate limiting
  app.use(limiter);
  app.use('/auth/login', authLimiter);
  app.use('/auth/register', authLimiter);

  // 3. Sanitización de datos - Prevenir inyección NoSQL
  app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ key }) => {
      console.warn(`⚠️ Sanitización detectada en ${key}`);
    },
  }));

  // 4. CORS Seguro
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS no permitido'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600,
  });

  // 5. Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
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
        return new BadRequestException({
          statusCode: 400,
          message: 'Validación fallida',
          errors: messages,
        });
      },
    }),
  );

  // 6. Headers de seguridad adicionales
  app.use((_req, res, next) => {
    // Prevenir clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    // Prevenir MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Habilitar XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Política de referrer
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Permisos de características
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
  });

  // 7. Logging de seguridad
  app.use((_req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logLevel = res.statusCode >= 400 ? '⚠️' : '✓';
      console.log(
        `${logLevel} ${_req.method} ${_req.path} - ${res.statusCode} (${duration}ms) - IP: ${_req.ip}`,
      );
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
