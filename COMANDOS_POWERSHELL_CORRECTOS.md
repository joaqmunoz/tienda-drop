# ✅ COMANDOS CORRECTOS PARA POWERSHELL

## 🔧 Comandos para Limpiar e Instalar

### Opción 1: Comandos PowerShell Nativos (RECOMENDADO)

```powershell
cd e:\Proyectos\ecommerce-dropi\backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
```

### Opción 2: Comandos Cortos PowerShell

```powershell
cd e:\Proyectos\ecommerce-dropi\backend
rm -r node_modules -Force
rm package-lock.json -ErrorAction SilentlyContinue
npm install
```

### Opción 3: Comando Único (Más Simple)

```powershell
cd e:\Proyectos\ecommerce-dropi\backend; rm -r node_modules -Force -ErrorAction SilentlyContinue; rm package-lock.json -ErrorAction SilentlyContinue; npm install
```

---

## 📋 Explicación de Comandos

| Comando | Descripción |
|---------|-------------|
| `cd e:\Proyectos\ecommerce-dropi\backend` | Ir a la carpeta backend |
| `Remove-Item -Recurse -Force node_modules` | Eliminar carpeta node_modules |
| `rm -r node_modules -Force` | Versión corta de Remove-Item |
| `Remove-Item package-lock.json -ErrorAction SilentlyContinue` | Eliminar package-lock.json (sin error si no existe) |
| `rm package-lock.json -ErrorAction SilentlyContinue` | Versión corta |
| `npm install` | Instalar dependencias |

---

## 🚀 PASOS COMPLETOS

### Paso 1: Abre PowerShell

Presiona `Win + X` y selecciona "Windows PowerShell" o "Terminal"

### Paso 2: Copia y Pega Este Comando

```powershell
cd e:\Proyectos\ecommerce-dropi\backend; rm -r node_modules -Force -ErrorAction SilentlyContinue; rm package-lock.json -ErrorAction SilentlyContinue; npm install
```

### Paso 3: Presiona Enter

Espera a que termine (1-2 minutos)

---

## ✅ Resultado Esperado

```
added 450 packages in 45s
```

---

## 🎯 Después de Instalar

### Terminal 1: Ejecutar Backend

```powershell
cd e:\Proyectos\ecommerce-dropi\backend
npm run dev
```

### Terminal 2: Ejecutar Frontend

```powershell
cd e:\Proyectos\ecommerce-dropi\frontend
npm run dev
```

---

## 📝 Diferencias: CMD vs PowerShell

| Acción | CMD | PowerShell |
|--------|-----|-----------|
| Eliminar carpeta | `rmdir /s /q` | `Remove-Item -Recurse -Force` |
| Eliminar archivo | `del` | `Remove-Item` |
| Versión corta | N/A | `rm` |

---

## ✨ RESUMEN

✅ **Usa los comandos de PowerShell**
✅ **Copia el comando único (Opción 3)**
✅ **Presiona Enter**
✅ **Espera a que termine**
✅ **Luego ejecuta `npm run dev`**

**¡Ahora funcionará correctamente! 🚀**
