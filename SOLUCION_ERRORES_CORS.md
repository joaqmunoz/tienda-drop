# ✅ SOLUCIÓN DE ERRORES CORS

## 🔴 PROBLEMA

```
Access to XMLHttpRequest at 'http://localhost:3001/products/categories' 
from origin 'http://127.0.0.1:64195' has been blocked by CORS policy
```

**Razón:** El backend no está corriendo o no tiene CORS configurado.

---

## ✅ SOLUCIÓN

### Paso 1: Verificar que el Backend está Corriendo

**Abre una NUEVA terminal** y ejecuta:

```bash
cd e:\Proyectos\ecommerce-dropi\backend
npm run dev
```

**Deberías ver:**
```
[Nest] 12345  - 11/03/2025, 1:34:50 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345  - 11/03/2025, 1:34:51 AM     LOG [RoutesResolver] AppController {/}:
🚀 Servidor ejecutándose en puerto 3001
```

### Paso 2: Verificar que el Frontend está Corriendo

**En OTRA terminal**, ejecuta:

```bash
cd e:\Proyectos\ecommerce-dropi\frontend
npm run dev
```

**Deberías ver:**
```
  ▲ Next.js 14.2.33
  - Local:        http://localhost:3000
  ✓ Ready in 2.5s
```

### Paso 3: Acceder a la Aplicación

Abre tu navegador en:
```
http://localhost:3000
```

---

## 📊 Estructura Correcta

Deberías tener **2 terminales abiertas**:

```
Terminal 1: Backend (Puerto 3001)
$ cd backend && npm run dev
✓ Servidor en http://localhost:3001

Terminal 2: Frontend (Puerto 3000)
$ cd frontend && npm run dev
✓ Servidor en http://localhost:3000
```

---

## 🔍 ¿Por qué el Error CORS?

### Causa 1: Backend No Está Corriendo
```
❌ Frontend intenta conectar a http://localhost:3001
❌ No hay nada escuchando en el puerto 3001
❌ CORS error
```

**Solución:** Ejecutar `npm run dev` en backend

### Causa 2: CORS No Configurado
```
❌ Backend está corriendo
❌ Pero CORS no está habilitado
❌ CORS error
```

**Solución:** Ya está configurado en `main.ts`

### Causa 3: URL Incorrecta
```
❌ Frontend intenta conectar a URL incorrecta
❌ Backend no responde
❌ CORS error
```

**Solución:** Verificar `NEXT_PUBLIC_API_URL` en `.env.local`

---

## 🔧 Configuración CORS en Backend

El backend ya tiene CORS configurado en `src/main.ts`:

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

**Esto permite:**
- ✅ Solicitudes desde `http://localhost:3000`
- ✅ Envío de cookies
- ✅ Autenticación

---

## 📝 Verificar Configuración Frontend

### Archivo: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Debe ser exactamente:**
- ✅ `http://localhost:3001` (sin trailing slash)
- ✅ Puerto 3001 (donde corre el backend)
- ✅ Sin HTTPS en desarrollo

---

## 🚀 Checklist

- [ ] Backend instalado: `npm install` en backend
- [ ] Frontend instalado: `npm install` en frontend
- [ ] Backend corriendo: `npm run dev` en backend (Terminal 1)
- [ ] Frontend corriendo: `npm run dev` en frontend (Terminal 2)
- [ ] `.env.local` configurado en frontend
- [ ] `NEXT_PUBLIC_API_URL=http://localhost:3001`
- [ ] Acceder a http://localhost:3000
- [ ] Errores CORS desaparecidos

---

## 🎯 Resultado Esperado

Después de ejecutar ambos servidores:

**En el navegador:**
- ✅ Página carga sin errores
- ✅ Productos se cargan correctamente
- ✅ No hay errores CORS
- ✅ Puedes iniciar sesión
- ✅ Puedes agregar productos al carrito

**En la consola:**
- ✅ [HMR] connected
- ✅ [Fast Refresh] rebuilding
- ✅ Sin errores de CORS
- ✅ Sin errores de módulos

---

## 🐛 Solución de Problemas

### Error: "Cannot GET /products/categories"

```
Backend no está corriendo
Solución: npm run dev en backend
```

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"

```
Backend no tiene CORS habilitado
Solución: Verificar main.ts tiene enableCors()
```

### Error: "Connection refused"

```
Backend no está en puerto 3001
Solución: Verificar que npm run dev está corriendo
```

### Error: "net::ERR_FAILED"

```
Frontend no puede conectar al backend
Solución: Verificar NEXT_PUBLIC_API_URL en .env.local
```

---

## 📋 Comandos Rápidos

```bash
# Terminal 1: Backend
cd e:\Proyectos\ecommerce-dropi\backend
npm install
npm run dev

# Terminal 2: Frontend
cd e:\Proyectos\ecommerce-dropi\frontend
npm install
npm run dev

# Luego acceder a:
# http://localhost:3000
```

---

## ✨ RESULTADO

✅ **Backend corriendo en puerto 3001**
✅ **Frontend corriendo en puerto 3000**
✅ **CORS habilitado correctamente**
✅ **Errores desaparecidos**
✅ **Aplicación funcionando**

**¡Ahora ejecuta ambos servidores y los errores desaparecerán! 🚀**
