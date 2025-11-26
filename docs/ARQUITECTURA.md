# 🏗️ Arquitectura del Proyecto E-Commerce Dropi

## Diagrama General

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Navegador)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   FRONTEND      │
                    │   (Next.js)     │
                    │   Puerto 3000   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────────────────┐
                    │   API REST Backend          │
                    │   (NestJS)                  │
                    │   Puerto 3001               │
                    └────────┬────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼─────┐      ┌──────▼──────┐      ┌─────▼──────┐
   │PostgreSQL│      │   Dropi     │      │  Stripe    │
   │Database  │      │   API       │      │  API       │
   └──────────┘      └─────────────┘      └────────────┘
```

---

## Capas de la Aplicación

### 1. Frontend (Next.js)
```
frontend/
├── pages/              # Rutas y páginas
│   ├── _app.tsx       # Configuración global
│   ├── index.tsx      # Página de inicio
│   ├── products.tsx   # Listado de productos
│   ├── cart.tsx       # Carrito
│   ├── login.tsx      # Login
│   └── register.tsx   # Registro
├── components/        # Componentes React
│   ├── Layout.tsx     # Layout principal
│   ├── ProductCard.tsx
│   └── CartSummary.tsx
├── lib/               # Utilidades
│   ├── api.ts         # Cliente HTTP
│   ├── useAuth.ts     # Hook de autenticación
│   └── useCart.ts     # Hook de carrito
├── types/             # Tipos TypeScript
└── styles/            # Estilos CSS
```

**Responsabilidades:**
- Renderizar interfaz de usuario
- Gestionar estado local (Zustand)
- Comunicarse con API backend
- Manejar autenticación del cliente

---

### 2. Backend (NestJS)
```
backend/
├── src/
│   ├── main.ts                 # Punto de entrada
│   ├── app.module.ts           # Módulo principal
│   ├── entities/               # Modelos de BD
│   │   ├── user.entity.ts
│   │   ├── product.entity.ts
│   │   ├── order.entity.ts
│   │   ├── order-item.entity.ts
│   │   └── provider.entity.ts
│   ├── common/
│   │   └── dtos/               # Data Transfer Objects
│   │       ├── auth.dto.ts
│   │       ├── product.dto.ts
│   │       └── order.dto.ts
│   └── modules/                # Módulos de negocio
│       ├── auth/               # Autenticación
│       │   ├── auth.service.ts
│       │   ├── auth.controller.ts
│       │   ├── jwt.strategy.ts
│       │   └── auth.module.ts
│       ├── products/           # Gestión de productos
│       │   ├── products.service.ts
│       │   ├── products.controller.ts
│       │   └── products.module.ts
│       ├── orders/             # Gestión de órdenes
│       │   ├── orders.service.ts
│       │   ├── orders.controller.ts
│       │   └── orders.module.ts
│       └── dropi/              # Integración Dropi
│           ├── dropi.service.ts
│           ├── dropi.controller.ts
│           └── dropi.module.ts
```

**Responsabilidades:**
- Procesar lógica de negocio
- Gestionar base de datos
- Autenticar usuarios
- Integrar con APIs externas
- Validar datos

---

### 3. Base de Datos (PostgreSQL)

```sql
-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zipCode VARCHAR(20),
  country VARCHAR(100),
  isAdmin BOOLEAN DEFAULT false,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Productos
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2),
  costPrice DECIMAL(10,2),
  stock INTEGER,
  sku VARCHAR(255),
  dropiId VARCHAR(255),
  provider VARCHAR(100),
  image TEXT,
  images TEXT[],
  category VARCHAR(100),
  rating DECIMAL(3,2),
  reviews INTEGER,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Órdenes
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  orderNumber VARCHAR(50) UNIQUE,
  userId UUID FOREIGN KEY,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
  subtotal DECIMAL(10,2),
  shippingCost DECIMAL(10,2),
  tax DECIMAL(10,2),
  total DECIMAL(10,2),
  shippingAddress TEXT,
  shippingCity VARCHAR(255),
  shippingState VARCHAR(255),
  shippingZip VARCHAR(20),
  shippingCountry VARCHAR(100),
  trackingNumber VARCHAR(100),
  dropiOrderId VARCHAR(100),
  stripePaymentId VARCHAR(100),
  notes TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Items de órdenes
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  orderId UUID FOREIGN KEY,
  productId UUID FOREIGN KEY,
  quantity INTEGER,
  price DECIMAL(10,2),
  subtotal DECIMAL(10,2)
);

-- Proveedores
CREATE TABLE providers (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  description TEXT,
  apiUrl VARCHAR(255),
  apiKey TEXT,
  apiSecret VARCHAR(100),
  isActive BOOLEAN DEFAULT true,
  syncInterval INTEGER,
  lastSync TIMESTAMP,
  productCount INTEGER,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

---

## Flujo de Datos

### 1. Autenticación
```
Usuario → Login Form → API /auth/login → JWT Token → LocalStorage
```

### 2. Compra de Producto
```
Cliente
  ↓
Selecciona Producto
  ↓
Agrega al Carrito (Zustand)
  ↓
Visualiza Carrito
  ↓
Procede a Checkout
  ↓
Ingresa Datos de Envío
  ↓
Realiza Pago (Stripe)
  ↓
Crea Orden en BD
  ↓
Envía Orden a Dropi
  ↓
Dropi Procesa y Envía
  ↓
Notificación por Email
  ↓
Cliente Recibe Producto
```

### 3. Sincronización de Productos
```
Cada 1 Hora
  ↓
Cron Job en Backend
  ↓
Obtiene Productos de Dropi API
  ↓
Actualiza BD Local
  ↓
Notifica cambios
```

### 4. Sincronización de Inventario
```
Cada 30 Minutos
  ↓
Cron Job en Backend
  ↓
Verifica Stock en Dropi
  ↓
Actualiza Stock en BD
  ↓
Notifica si hay cambios
```

---

## Módulos y Responsabilidades

### AuthModule
- Registro de usuarios
- Login con JWT
- Validación de tokens
- Protección de rutas

### ProductsModule
- CRUD de productos
- Búsqueda y filtrado
- Sincronización con Dropi
- Gestión de inventario

### OrdersModule
- Creación de órdenes
- Gestión de estado
- Cálculo de totales
- Integración con Dropi

### DropiModule
- Comunicación con API Dropi
- Sincronización de productos
- Creación de órdenes
- Manejo de webhooks

---

## Seguridad

```
┌─────────────────────────────────────────┐
│         HTTPS en Producción             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    JWT Token en Headers (Bearer)        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Validación de DTOs en Backend        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Encriptación de Contraseñas (bcrypt) │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Variables de Entorno Seguras         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Rate Limiting en API                 │
└─────────────────────────────────────────┘
```

---

## Escalabilidad

### Horizontal
- Frontend: Desplegar múltiples instancias en Vercel
- Backend: Desplegar múltiples instancias en Railway/Heroku
- BD: Usar réplicas de PostgreSQL

### Vertical
- Aumentar recursos de servidores
- Optimizar queries de BD
- Implementar caching (Redis)

### Optimizaciones
- CDN para imágenes
- Compresión de assets
- Lazy loading de componentes
- Índices en BD

---

## Despliegue

```
┌──────────────────┐
│   GitHub Repo    │
└────────┬─────────┘
         │
    ┌────▼─────┐
    │ CI/CD     │
    │ (Actions) │
    └────┬─────┘
         │
    ┌────┴─────────────────┐
    │                      │
┌───▼────┐          ┌──────▼──┐
│ Vercel │          │ Railway  │
│Frontend │          │ Backend  │
└────────┘          └──────────┘
```

---

## Monitoreo

```
┌─────────────────────────────────────────┐
│        Logs (Console / File)            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Sentry (Error Tracking)              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    DataDog / New Relic (APM)            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Alertas y Notificaciones             │
└─────────────────────────────────────────┘
```

---

## Tecnologías por Capa

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | Next.js | 14.0 |
| Frontend | React | 18.2 |
| Frontend | TypeScript | 5.3 |
| Frontend | Tailwind CSS | 3.3 |
| Backend | NestJS | 10.2 |
| Backend | TypeScript | 5.3 |
| Backend | TypeORM | 0.3 |
| BD | PostgreSQL | 14+ |
| Auth | JWT | - |
| Pagos | Stripe | API v1 |
| Email | SendGrid | API v3 |

---

## Próximas Mejoras

- [ ] Implementar Redis para caching
- [ ] Agregar GraphQL
- [ ] Implementar WebSockets para notificaciones en tiempo real
- [ ] Agregar búsqueda con Elasticsearch
- [ ] Implementar microservicios
- [ ] Agregar testing automatizado
- [ ] Implementar CI/CD completo
