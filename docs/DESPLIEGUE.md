#  Guía de Despliegue - E-Commerce Dropi

## Opciones de Despliegue

### Opción 1: Despliegue Local (Desarrollo)

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## Opción 2: Despliegue con Docker

### Requisitos
- Docker instalado
- Docker Compose instalado

### Pasos

1. **Copiar archivo de configuración**
```bash
cp docker-compose.example.yml docker-compose.yml
```

2. **Editar variables de entorno**
```bash
nano docker-compose.yml
# Actualizar credenciales de Stripe, Dropi, SendGrid, etc.
```

3. **Iniciar servicios**
```bash
docker-compose up -d
```

4. **Ver logs**
```bash
docker-compose logs -f
```

5. **Detener servicios**
```bash
docker-compose down
```

---

## Opción 3: Despliegue en Producción

### Frontend - Vercel

#### Paso 1: Preparar repositorio
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

#### Paso 2: Conectar a Vercel
1. Ir a https://vercel.com
2. Importar proyecto desde GitHub
3. Seleccionar repositorio
4. Configurar variables de entorno:
   - `NEXT_PUBLIC_API_URL` = URL del backend
   - `NEXT_PUBLIC_STRIPE_KEY` = Stripe public key
   - `NEXTAUTH_URL` = URL de producción
   - `NEXTAUTH_SECRET` = Secret generado

#### Paso 3: Desplegar
```bash
vercel deploy --prod
```

### Backend - Railway o Heroku

#### Opción A: Railway

1. Ir a https://railway.app
2. Crear nuevo proyecto
3. Conectar repositorio GitHub
4. Agregar variables de entorno:
   - `NODE_ENV` = production
   - `DB_HOST` = Host de PostgreSQL
   - `DB_PORT` = 5432
   - `DB_USERNAME` = Usuario
   - `DB_PASSWORD` = Contraseña
   - `DB_NAME` = Nombre de BD
   - `JWT_SECRET` = Secret generado
   - `STRIPE_SECRET_KEY` = Stripe secret key
   - `DROPI_API_KEY` = API key de Dropi
   - `SENDGRID_API_KEY` = SendGrid API key
   - `FRONTEND_URL` = URL del frontend

5. Desplegar automáticamente

#### Opción B: Heroku

1. Instalar Heroku CLI
```bash
npm install -g heroku
heroku login
```

2. Crear aplicación
```bash
heroku create nombre-app-backend
```

3. Agregar PostgreSQL
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

4. Configurar variables de entorno
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=tu_secret_aqui
# ... más variables
```

5. Desplegar
```bash
git push heroku main
```

---

## Base de Datos en Producción

### PostgreSQL en la Nube

#### Opción 1: AWS RDS
1. Ir a AWS RDS
2. Crear instancia PostgreSQL
3. Configurar seguridad
4. Obtener endpoint
5. Actualizar `DB_HOST` en variables de entorno

#### Opción 2: Railway
1. Agregar servicio PostgreSQL
2. Railway proporciona `DATABASE_URL`
3. Usar en backend

#### Opción 3: Heroku PostgreSQL
```bash
heroku addons:create heroku-postgresql:standard-0
```

---

## Variables de Entorno en Producción

### Backend (.env)
```env
NODE_ENV=production
PORT=3001

# Database
DB_HOST=tu-host-postgres.com
DB_PORT=5432
DB_USERNAME=usuario
DB_PASSWORD=contraseña_segura
DB_NAME=ecommerce_dropi

# JWT
JWT_SECRET=tu_jwt_secret_muy_largo_y_seguro
JWT_EXPIRATION=7d

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Dropi
DROPI_API_KEY=tu_dropi_api_key
DROPI_API_URL=https://api.dropi.com

# SendGrid
SENDGRID_API_KEY=tu_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@tudominio.com

# Frontend
FRONTEND_URL=https://tudominio.com
```

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com
NEXT_PUBLIC_STRIPE_KEY=pk_live_...
NEXTAUTH_URL=https://tudominio.com
NEXTAUTH_SECRET=tu_secret_muy_largo
```

---

## SSL/HTTPS

### Vercel
- Automático con certificado Let's Encrypt

### Railway/Heroku
- Automático con certificado Let's Encrypt

### Dominio Personalizado
1. Comprar dominio (GoDaddy, Namecheap, etc.)
2. Configurar DNS
3. Apuntar a servicio de hosting
4. Configurar SSL

---

## Monitoreo en Producción

### Logs
```bash
# Vercel
vercel logs

# Railway
railway logs

# Heroku
heroku logs --tail
```

### Errores
- Sentry: https://sentry.io
- Rollbar: https://rollbar.com
- LogRocket: https://logrocket.com

### Performance
- Datadog: https://www.datadoghq.com
- New Relic: https://newrelic.com
- Elastic: https://www.elastic.co

---

## Backup de Base de Datos

### PostgreSQL
```bash
# Backup
pg_dump -U usuario -d ecommerce_dropi > backup.sql

# Restaurar
psql -U usuario -d ecommerce_dropi < backup.sql
```

### Automatizado
- AWS Backup
- Heroku Backups
- Railway Backups

---

## Escalabilidad

### Horizontal
- Múltiples instancias del backend
- Load balancer (Nginx, HAProxy)
- CDN para frontend (Cloudflare)

### Vertical
- Aumentar recursos de servidor
- Optimizar queries de BD
- Implementar caching (Redis)

### Optimizaciones
- Compresión de assets
- Lazy loading
- Minificación
- Image optimization

---

## Checklist de Despliegue

### Antes de Desplegar
- [ ] Código revisado y testeado
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] SSL/HTTPS configurado
- [ ] Dominio apuntando correctamente
- [ ] Backups configurados
- [ ] Monitoreo configurado
- [ ] Alertas configuradas

### Después de Desplegar
- [ ] Verificar frontend carga correctamente
- [ ] Verificar backend responde
- [ ] Probar autenticación
- [ ] Probar crear orden
- [ ] Verificar sincronización con Dropi
- [ ] Verificar emails se envían
- [ ] Monitorear logs
- [ ] Verificar performance

---

## Troubleshooting

### Error: "Cannot connect to database"
- Verificar credenciales de BD
- Verificar firewall
- Verificar host de BD

### Error: "CORS error"
- Verificar FRONTEND_URL en backend
- Verificar NEXT_PUBLIC_API_URL en frontend

### Error: "JWT token invalid"
- Verificar JWT_SECRET es igual en backend
- Verificar token no expiró

### Error: "Stripe payment failed"
- Verificar STRIPE_SECRET_KEY
- Verificar webhook configurado
- Verificar modo de prueba vs producción

---

## Rollback

Si algo falla en producción:

### Vercel
```bash
vercel rollback
```

### Railway
- Ir a deployments
- Seleccionar versión anterior
- Hacer rollback

### Heroku
```bash
heroku releases
heroku rollback v123
```

---

## Mantenimiento

### Actualizaciones
```bash
# Verificar actualizaciones
npm outdated

# Actualizar dependencias
npm update

# Actualizar major versions
npm install -g npm-check-updates
ncu -u
npm install
```

### Limpieza
```bash
# Limpiar caché
npm cache clean --force

# Limpiar node_modules
rm -rf node_modules
npm install
```

### Monitoreo Regular
- Revisar logs diariamente
- Verificar performance
- Revisar alertas
- Verificar backups

---

## Costos Estimados

| Servicio | Costo Mensual |
|----------|--------------|
| Vercel (Frontend) | Gratis - $20 |
| Railway (Backend) | $5 - $50 |
| PostgreSQL | $15 - $100 |
| Stripe | 2.9% + $0.30 |
| SendGrid | Gratis - $100 |
| **Total** | **$20 - $300** |

---

## Recursos Útiles

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Heroku Docs](https://devcenter.heroku.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## Contacto y Soporte

Si necesitas ayuda con el despliegue:
1. Revisa la documentación oficial
2. Consulta los logs
3. Verifica las variables de entorno
4. Contacta al soporte del servicio

¡Éxito en tu despliegue! 
