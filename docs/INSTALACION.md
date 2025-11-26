# 📦 Guía de Instalación y Configuración

## Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior (o yarn)
- **PostgreSQL** v14 o superior
- **Git**

## Paso 1: Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd ecommerce-dropi
```

## Paso 2: Configurar PostgreSQL

### En Windows (usando pgAdmin o línea de comandos):

```sql
-- Crear base de datos
CREATE DATABASE ecommerce_dropi;

-- Crear usuario
CREATE USER ecommerce_user WITH PASSWORD 'tu_contraseña_segura';

-- Otorgar permisos
ALTER ROLE ecommerce_user SET client_encoding TO 'utf8';
ALTER ROLE ecommerce_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE ecommerce_user SET default_transaction_deferrable TO on;
ALTER ROLE ecommerce_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE ecommerce_dropi TO ecommerce_user;
```

### Verificar conexión:

```bash
psql -U ecommerce_user -d ecommerce_dropi -h localhost
```

## Paso 3: Configurar Backend

### 3.1 Instalar dependencias

```bash
cd backend
npm install
```

### 3.2 Crear archivo .env

```bash
cp .env.example .env
```

### 3.3 Editar .env con tus valores

```env
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=ecommerce_user
DB_PASSWORD=tu_contraseña_segura
DB_NAME=ecommerce_dropi

# JWT
JWT_SECRET=tu_jwt_secret_muy_largo_y_seguro_aqui
JWT_EXPIRATION=7d

# Stripe (obtener de https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Dropi (obtener de tu cuenta Dropi)
DROPI_API_KEY=tu_dropi_api_key_aqui
DROPI_API_URL=https://api.dropi.com

# SendGrid (obtener de https://sendgrid.com)
SENDGRID_API_KEY=tu_sendgrid_api_key_aqui
SENDGRID_FROM_EMAIL=noreply@tudominio.com

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 3.4 Ejecutar migraciones (cuando estén creadas)

```bash
npm run migration:run
```

### 3.5 Iniciar servidor de desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

## Paso 4: Configurar Frontend

### 4.1 Instalar dependencias

```bash
cd ../frontend
npm install
```

### 4.2 Crear archivo .env.local

```bash
cp .env.example .env.local
```

### 4.3 Editar .env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secret_muy_largo_aqui
```

### 4.4 Iniciar servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## Paso 5: Verificar Instalación

### Verificar Backend

```bash
curl http://localhost:3001/health
```

Debería retornar:
```json
{
  "status": "ok",
  "timestamp": "2025-11-03T00:00:00Z"
}
```

### Verificar Frontend

Abre en el navegador: `http://localhost:3000`

## Obtener Credenciales de APIs

### Stripe

1. Ir a https://dashboard.stripe.com
2. Crear cuenta o iniciar sesión
3. Ir a Developers → API Keys
4. Copiar `Publishable key` (NEXT_PUBLIC_STRIPE_KEY)
5. Copiar `Secret key` (STRIPE_SECRET_KEY)

### Dropi

1. Ir a https://www.dropi.com
2. Crear cuenta como vendedor
3. Ir a Configuración → API
4. Generar API Key
5. Copiar la clave en DROPI_API_KEY

### SendGrid

1. Ir a https://sendgrid.com
2. Crear cuenta
3. Ir a Settings → API Keys
4. Crear nueva API Key
5. Copiar en SENDGRID_API_KEY

## Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:5432"

**Solución**: PostgreSQL no está corriendo
```bash
# Windows
net start postgresql-x64-14

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Error: "EADDRINUSE: address already in use :::3001"

**Solución**: Puerto 3001 ya está en uso
```bash
# Cambiar puerto en .env
PORT=3002

# O matar proceso en puerto 3001
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3001
kill -9 <PID>
```

### Error: "Cannot find module 'typeorm'"

**Solución**: Reinstalar dependencias
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Error: "NEXT_PUBLIC_API_URL is not defined"

**Solución**: Crear archivo .env.local en frontend
```bash
cd frontend
cp .env.example .env.local
```

## Próximos Pasos

1. ✅ Instalación completada
2. ⏭️ Crear migraciones de BD
3. ⏭️ Implementar autenticación
4. ⏭️ Crear módulos de API
5. ⏭️ Desarrollar interfaz de usuario

## Comandos Útiles

```bash
# Backend
cd backend
npm run dev              # Iniciar en desarrollo
npm run build            # Compilar
npm run lint             # Verificar código
npm test                 # Ejecutar tests

# Frontend
cd frontend
npm run dev              # Iniciar en desarrollo
npm run build            # Compilar
npm run lint             # Verificar código
npm test                 # Ejecutar tests

# Base de datos
npm run migration:generate -- -n NombreMigracion
npm run migration:run
npm run migration:revert
```

## Documentación Adicional

- [NestJS Docs](https://docs.nestjs.com)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeORM Docs](https://typeorm.io)
- [Stripe Docs](https://stripe.com/docs)
- [Dropi Docs](https://docs.dropi.com)
