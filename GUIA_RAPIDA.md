# 🚀 Guía Rápida de Inicio - E-Commerce Dropi

## ⚡ Inicio Rápido (5 minutos)

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd ecommerce-dropi
```

### 2. Instalar dependencias
```bash
# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd frontend
npm install
```

### 3. Configurar variables de entorno

**Backend** - Crear `backend/.env`:
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce_dropi
JWT_SECRET=tu_jwt_secret_aqui
STRIPE_SECRET_KEY=sk_test_...
DROPI_API_KEY=tu_dropi_api_key_aqui
DROPI_API_URL=https://api.dropi.com
SENDGRID_API_KEY=tu_sendgrid_api_key_aqui
FRONTEND_URL=http://localhost:3000
```

**Frontend** - Crear `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secret_aqui
```

### 4. Iniciar PostgreSQL
```bash
# Windows (si está instalado)
net start postgresql-x64-14

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### 5. Crear base de datos
```bash
psql -U postgres -c "CREATE DATABASE ecommerce_dropi;"
psql -U postgres -c "CREATE USER ecommerce_user WITH PASSWORD 'postgres';"
psql -U postgres -c "ALTER ROLE ecommerce_user SET client_encoding TO 'utf8';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ecommerce_dropi TO ecommerce_user;"
```

### 6. Iniciar servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend en `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend en `http://localhost:3000`

---

## 📋 Checklist de Configuración

- [ ] Node.js v18+ instalado
- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `ecommerce_dropi` creada
- [ ] Archivos `.env` configurados
- [ ] Dependencias instaladas (`npm install`)
- [ ] Backend iniciado (`npm run dev`)
- [ ] Frontend iniciado (`npm run dev`)

---

## 🧪 Pruebas Rápidas

### Verificar Backend
```bash
curl http://localhost:3001/health
```

### Crear usuario de prueba
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Obtener productos
```bash
curl http://localhost:3001/products
```

---

## 🐳 Con Docker (Alternativa)

### Requisitos
- Docker instalado
- Docker Compose instalado

### Pasos
```bash
# Copiar archivo de ejemplo
cp docker-compose.example.yml docker-compose.yml

# Editar variables de entorno en docker-compose.yml
nano docker-compose.yml

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

---

## 🔑 Obtener Credenciales de APIs

### Stripe
1. Ir a https://dashboard.stripe.com
2. Crear cuenta o iniciar sesión
3. Ir a Developers → API Keys
4. Copiar claves en `.env`

### Dropi
1. Ir a https://www.dropi.com
2. Crear cuenta como vendedor
3. Ir a Configuración → API
4. Generar API Key

### SendGrid
1. Ir a https://sendgrid.com
2. Crear cuenta
3. Ir a Settings → API Keys
4. Crear nueva API Key

---

## 🐛 Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
PostgreSQL no está corriendo. Iniciar con:
```bash
# Windows
net start postgresql-x64-14

# macOS
brew services start postgresql
```

### Error: "EADDRINUSE: address already in use :::3001"
Puerto 3001 ocupado. Cambiar en `.env`:
```env
PORT=3002
```

### Error: "Cannot find module"
Reinstalar dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de base de datos
Verificar credenciales en `.env` y que PostgreSQL esté corriendo.

---

## 📚 Documentación Completa

- [Puntos Importantes](./docs/PUNTOS_IMPORTANTES.md)
- [Instalación Detallada](./docs/INSTALACION.md)
- [Integración Dropi](./docs/INTEGRACION_DROPI.md)
- [Progreso del Proyecto](./docs/PROGRESO.md)

---

## 💡 Tips Útiles

### Ver logs en tiempo real
```bash
# Backend
npm run dev

# Frontend
npm run dev
```

### Limpiar caché
```bash
# Frontend
rm -rf .next

# Backend
rm -rf dist
```

### Resetear base de datos
```bash
# Conectar a PostgreSQL
psql -U postgres

# Eliminar base de datos
DROP DATABASE ecommerce_dropi;

# Crear nueva
CREATE DATABASE ecommerce_dropi;
```

### Generar JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🎯 Próximos Pasos

1. ✅ Instalar y configurar
2. ⏭️ Crear cuenta de usuario
3. ⏭️ Explorar productos
4. ⏭️ Agregar al carrito
5. ⏭️ Realizar compra (cuando Stripe esté integrado)

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs del servidor
2. Verifica las variables de entorno
3. Consulta la documentación completa
4. Revisa los issues del repositorio

¡Bienvenido al proyecto! 🎉
