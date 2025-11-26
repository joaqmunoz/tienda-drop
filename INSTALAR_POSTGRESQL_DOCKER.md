# 🐘 INSTALAR POSTGRESQL CON DOCKER EN WSL

## ✅ PASO 1: Instalar Docker Desktop

1. Descarga Docker Desktop desde: https://www.docker.com/products/docker-desktop
2. Ejecuta el instalador
3. Reinicia tu computadora
4. Abre PowerShell y verifica:

```powershell
docker --version
```

Deberías ver: `Docker version XX.X.X`

---

## ✅ PASO 2: Crear el Archivo `.env` en Backend

En la carpeta `e:\Proyectos\ecommerce-dropi\backend\`, crea un archivo llamado `.env` con este contenido:

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce_dropi

# JWT
JWT_SECRET=tu_secret_muy_largo_minimo_32_caracteres_aleatorios_aqui
JWT_EXPIRATION=24h

# Dropi API
DROPI_API_URL=https://api.dropi.com
DROPI_API_KEY=tu_api_key_aqui

# Stripe
STRIPE_SECRET_KEY=sk_test_tu_stripe_key_aqui

# SendGrid
SENDGRID_API_KEY=tu_sendgrid_key_aqui
```

---

## ✅ PASO 3: Ejecutar PostgreSQL con Docker

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
docker run --name postgres-ecommerce `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=ecommerce_dropi `
  -p 5432:5432 `
  -d postgres:15
```

**Resultado esperado**:
```
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## ✅ PASO 4: Verificar que PostgreSQL está Corriendo

```powershell
docker ps
```

Deberías ver:
```
CONTAINER ID   IMAGE         COMMAND                  CREATED         STATUS         PORTS                    NAMES
XXXXXXXX       postgres:15   "docker-entrypoint..."   X minutes ago    Up X minutes   0.0.0.0:5432->5432/tcp  postgres-ecommerce
```

---

## ✅ PASO 5: Iniciar el Backend

En PowerShell, en la carpeta `backend`:

```powershell
npm run dev
```

**Resultado esperado**:
```
[2:44:40 p. m.] Found 0 errors. Watching for file changes.

[Nest] 14092  - 04-11-2025, 2:44:40 p. m.   LOG [NestFactory] Starting Nest application...
[Nest] 14092  - 04-11-2025, 2:44:41 p. m.   LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 14092  - 04-11-2025, 2:44:41 p. m.   LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 14092  - 04-11-2025, 2:44:41 p. m.   LOG [InstanceLoader] AuthModule dependencies initialized
[Nest] 14092  - 04-11-2025, 2:44:41 p. m.   LOG [InstanceLoader] ProductsModule dependencies initialized
[Nest] 14092  - 04-11-2025, 2:44:41 p. m.   LOG [InstanceLoader] OrdersModule dependencies initialized

🚀 SERVIDOR SEGURO INICIADO
Puerto: 3001
Ambiente: development
Seguridad: ✓ Helmet.js
Seguridad: ✓ Rate Limiting
Seguridad: ✓ CORS Validado
Seguridad: ✓ Sanitización de Datos
```

---

## 🎯 COMANDOS ÚTILES DE DOCKER

### Ver logs de PostgreSQL
```powershell
docker logs postgres-ecommerce
```

### Detener PostgreSQL
```powershell
docker stop postgres-ecommerce
```

### Iniciar PostgreSQL nuevamente
```powershell
docker start postgres-ecommerce
```

### Eliminar PostgreSQL (⚠️ CUIDADO: Borra los datos)
```powershell
docker rm postgres-ecommerce
```

### Conectar a PostgreSQL con psql
```powershell
docker exec -it postgres-ecommerce psql -U postgres -d ecommerce_dropi
```

---

## 📊 ESTADO FINAL

| Componente | Estado |
|-----------|--------|
| Docker | ✅ Instalado |
| PostgreSQL | ✅ Corriendo en puerto 5432 |
| Backend | ✅ Conectado a BD |
| Frontend | ✅ Corriendo en puerto 3000 |
| Base de Datos | ✅ ecommerce_dropi |

---

## 🌐 ACCESO A LA APLICACIÓN

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

---

## ✨ CONCLUSIÓN

✅ **PostgreSQL instalado con Docker**
✅ **Backend conectado a la base de datos**
✅ **Frontend corriendo correctamente**
✅ **100% listo para desarrollo**

**¡Tu e-commerce está completamente funcional! 🚀**
