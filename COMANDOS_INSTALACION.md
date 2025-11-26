# 📝 COMANDOS DE INSTALACIÓN Y MANTENIMIENTO

## 🎯 Resumen

Aquí están todos los comandos que necesitas para instalar dependencias, evitar errores y mantener el proyecto actualizado.

---

## 🚀 INSTALACIÓN INICIAL

### Paso 1: Instalar Dependencias del Backend

```bash
cd e:\Proyectos\ecommerce-dropi\backend
npm install
```

**Qué hace:**
- Descarga todas las dependencias de NestJS
- Crea carpeta `node_modules`
- Crea archivo `package-lock.json`
- Instala tipos TypeScript

### Paso 2: Instalar Dependencias del Frontend

```bash
cd e:\Proyectos\ecommerce-dropi\frontend
npm install
```

**Qué hace:**
- Descarga todas las dependencias de Next.js
- Instala React, TypeScript, Tailwind CSS, NextAuth
- Crea carpeta `node_modules`
- Crea archivo `package-lock.json`

---

## ▶️ EJECUTAR EL PROYECTO

### Terminal 1: Backend

```bash
cd e:\Proyectos\ecommerce-dropi\backend
npm run dev
```

**Resultado esperado:**
```
[Nest] 12345  - 11/03/2025, 1:31:14 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 11/03/2025, 1:31:15 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345  - 11/03/2025, 1:31:16 AM     LOG [RoutesResolver] AppController {/}:
✓ Server running on http://localhost:3001
```

### Terminal 2: Frontend

```bash
cd e:\Proyectos\ecommerce-dropi\frontend
npm run dev
```

**Resultado esperado:**
```
  ▲ Next.js 14.2.33
  - Local:        http://localhost:3000
  ✓ Ready in 2.5s
```

---

## 🔄 ACTUALIZAR DEPENDENCIAS

### Opción 1: Actualizar a Versiones Compatibles (RECOMENDADO)

```bash
# Backend
cd e:\Proyectos\ecommerce-dropi\backend
npm update

# Frontend
cd e:\Proyectos\ecommerce-dropi\frontend
npm update
```

**Qué hace:**
- Actualiza a versiones menores y patches
- Mantiene compatibilidad
- No rompe el código

### Opción 2: Actualizar a Últimas Versiones (CUIDADO)

```bash
# Backend
cd e:\Proyectos\ecommerce-dropi\backend
npm upgrade

# Frontend
cd e:\Proyectos\ecommerce-dropi\frontend
npm upgrade
```

**Qué hace:**
- Actualiza a versiones mayores
- Puede romper compatibilidad
- Requiere pruebas exhaustivas

---

## 🧹 LIMPIAR ERRORES Y CACHÉ

### Limpiar node_modules y Reinstalar

```bash
# Backend
cd e:\Proyectos\ecommerce-dropi\backend
rmdir /s /q node_modules
del package-lock.json
npm install

# Frontend
cd e:\Proyectos\ecommerce-dropi\frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

**Cuándo usar:**
- Cuando hay errores de módulos no encontrados
- Cuando hay conflictos de versiones
- Cuando el proyecto no inicia

### Limpiar Caché de npm

```bash
npm cache clean --force
```

**Cuándo usar:**
- Cuando hay problemas de descarga
- Cuando npm está lento
- Cuando hay errores de instalación

---

## 🔍 VERIFICAR INSTALACIÓN

### Ver Versiones Instaladas

```bash
# Backend
cd e:\Proyectos\ecommerce-dropi\backend
npm list

# Frontend
cd e:\Proyectos\ecommerce-dropi\frontend
npm list
```

### Ver Versiones de Paquetes Específicos

```bash
# Backend
cd e:\Proyectos\ecommerce-dropi\backend
npm list @nestjs/core
npm list typeorm

# Frontend
cd e:\Proyectos\ecommerce-dropi\frontend
npm list next
npm list react
npm list next-auth
```

### Verificar que Todo está Instalado

```bash
# Backend
cd e:\Proyectos\ecommerce-dropi\backend
npm audit

# Frontend
cd e:\Proyectos\ecommerce-dropi\frontend
npm audit
```

---

## 🛠️ INSTALAR PAQUETES NUEVOS

### Agregar Paquete al Backend

```bash
cd e:\Proyectos\ecommerce-dropi\backend
npm install nombre-del-paquete
```

### Agregar Paquete al Frontend

```bash
cd e:\Proyectos\ecommerce-dropi\frontend
npm install nombre-del-paquete
```

### Agregar Paquete como DevDependency

```bash
# Backend
cd e:\Proyectos\ecommerce-dropi\backend
npm install --save-dev nombre-del-paquete

# Frontend
cd e:\Proyectos\ecommerce-dropi\frontend
npm install --save-dev nombre-del-paquete
```

---

## 🧪 VERIFICAR ERRORES DE TIPOS

### TypeScript - Backend

```bash
cd e:\Proyectos\ecommerce-dropi\backend
npm run type-check
```

### TypeScript - Frontend

```bash
cd e:\Proyectos\ecommerce-dropi\frontend
npm run type-check
```

---

## 🏗️ COMPILAR PARA PRODUCCIÓN

### Backend

```bash
cd e:\Proyectos\ecommerce-dropi\backend
npm run build
npm run prod
```

### Frontend

```bash
cd e:\Proyectos\ecommerce-dropi\frontend
npm run build
npm run start
```

---

## 📋 COMANDOS RÁPIDOS

### Script para Instalar Todo (Windows PowerShell)

```powershell
# Instalar backend
cd e:\Proyectos\ecommerce-dropi\backend
npm install
Write-Host "Backend instalado ✓"

# Instalar frontend
cd e:\Proyectos\ecommerce-dropi\frontend
npm install
Write-Host "Frontend instalado ✓"

Write-Host "¡Todo instalado! Ejecuta npm run dev en cada carpeta"
```

### Script para Limpiar Todo (Windows PowerShell)

```powershell
# Limpiar backend
cd e:\Proyectos\ecommerce-dropi\backend
rmdir /s /q node_modules
del package-lock.json
npm install
Write-Host "Backend limpiado ✓"

# Limpiar frontend
cd e:\Proyectos\ecommerce-dropi\frontend
rmdir /s /q node_modules
del package-lock.json
npm install
Write-Host "Frontend limpiado ✓"
```

---

## 🚨 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "Cannot find module 'next-auth'"

```bash
cd e:\Proyectos\ecommerce-dropi\frontend
npm install next-auth
```

### Error: "Cannot find module '@nestjs/core'"

```bash
cd e:\Proyectos\ecommerce-dropi\backend
npm install @nestjs/core
```

### Error: "npm ERR! code ERESOLVE"

```bash
# Usar --legacy-peer-deps
cd e:\Proyectos\ecommerce-dropi\frontend
npm install --legacy-peer-deps
```

### Error: "Port 3000 already in use"

```bash
# Cambiar puerto en next.js
npm run dev -- -p 3001
```

### Error: "Port 3001 already in use"

```bash
# Cambiar puerto en NestJS
npm run dev -- --port 3002
```

---

## 📅 MANTENIMIENTO REGULAR

### Semanal

```bash
# Verificar vulnerabilidades
npm audit

# Actualizar dependencias menores
npm update
```

### Mensual

```bash
# Limpiar caché
npm cache clean --force

# Verificar versiones
npm outdated
```

### Trimestral

```bash
# Actualizar a versiones mayores (con cuidado)
npm upgrade

# Ejecutar pruebas
npm test
```

---

## 📝 CHECKLIST DE INSTALACIÓN

- [ ] Instalar backend: `npm install` en backend
- [ ] Instalar frontend: `npm install` en frontend
- [ ] Crear `.env.local` en frontend
- [ ] Crear `.env` en backend
- [ ] Configurar Google OAuth
- [ ] Configurar PostgreSQL
- [ ] Ejecutar `npm run dev` en backend
- [ ] Ejecutar `npm run dev` en frontend
- [ ] Acceder a http://localhost:3000
- [ ] Verificar que no hay errores

---

## 🎯 RESUMEN

### Para Instalar Inicialmente:
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Para Ejecutar:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Para Actualizar:
```bash
# Backend
cd backend && npm update

# Frontend
cd frontend && npm update
```

### Para Limpiar Errores:
```bash
# Backend
cd backend && rmdir /s /q node_modules && del package-lock.json && npm install

# Frontend
cd frontend && rmdir /s /q node_modules && del package-lock.json && npm install
```

---

## ✨ RESULTADO

✅ **Dependencias instaladas correctamente**
✅ **No hay errores de módulos no encontrados**
✅ **Proyecto listo para ejecutar**
✅ **Mantenimiento futuro facilitado**

**¡Ahora puedes ejecutar el proyecto sin errores! 🚀**
