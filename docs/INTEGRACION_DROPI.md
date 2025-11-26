# 🔗 Integración con Dropi

## Requisitos Previos

1. Cuenta en Dropi (https://www.dropi.com)
2. API Key de Dropi
3. Acceso a la documentación de API de Dropi

## Obtener Credenciales

### Paso 1: Crear cuenta en Dropi
1. Ir a https://www.dropi.com
2. Registrarse como vendedor
3. Completar el perfil

### Paso 2: Obtener API Key
1. Ir a Configuración → API
2. Generar nueva API Key
3. Copiar la clave (se mostrará solo una vez)
4. Guardar en `.env` como `DROPI_API_KEY`

## Endpoints de Dropi

### Obtener Productos
```
GET https://api.dropi.com/v1/products
Headers:
  Authorization: Bearer {DROPI_API_KEY}
  Content-Type: application/json
```

### Crear Pedido
```
POST https://api.dropi.com/v1/orders
Headers:
  Authorization: Bearer {DROPI_API_KEY}
  Content-Type: application/json

Body:
{
  "customer": {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+34123456789"
  },
  "items": [
    {
      "product_id": "123",
      "quantity": 1
    }
  ],
  "shipping_address": {
    "street": "Calle Principal 123",
    "city": "Madrid",
    "state": "Madrid",
    "zip": "28001",
    "country": "ES"
  }
}
```

### Verificar Estado de Pedido
```
GET https://api.dropi.com/v1/orders/{order_id}
Headers:
  Authorization: Bearer {DROPI_API_KEY}
```

## Sincronización de Productos

### Estrategia
- **Frecuencia**: Cada 1 hora
- **Método**: Cron job en el backend
- **Almacenamiento**: Base de datos local

### Implementación
```typescript
// En backend/src/modules/products/products.service.ts

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class ProductsService {
  @Cron('0 * * * *') // Cada hora
  async syncProductsFromDropi() {
    try {
      const response = await axios.get(
        `${process.env.DROPI_API_URL}/v1/products`,
        {
          headers: {
            Authorization: `Bearer ${process.env.DROPI_API_KEY}`,
          },
        },
      );

      // Guardar productos en BD
      for (const product of response.data.products) {
        await this.saveOrUpdateProduct(product);
      }

      console.log('✅ Productos sincronizados desde Dropi');
    } catch (error) {
      console.error('❌ Error sincronizando productos:', error);
    }
  }

  private async saveOrUpdateProduct(dropiProduct: any) {
    // Implementar lógica de guardado
  }
}
```

## Sincronización de Inventario

### Estrategia
- **Frecuencia**: Cada 30 minutos
- **Método**: Cron job
- **Actualización**: Stock en tiempo real

## Creación de Pedidos

### Flujo
1. Cliente completa compra en el sitio
2. Pago procesado por Stripe
3. Orden creada en BD
4. Orden enviada a Dropi
5. Dropi procesa y envía
6. Notificación al cliente

### Implementación
```typescript
// En backend/src/modules/orders/orders.service.ts

async createOrderInDropi(order: Order) {
  const dropiOrder = {
    customer: {
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
    },
    items: order.items.map(item => ({
      product_id: item.product.dropiId,
      quantity: item.quantity,
    })),
    shipping_address: {
      street: order.shippingAddress.street,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      zip: order.shippingAddress.zip,
      country: order.shippingAddress.country,
    },
  };

  const response = await axios.post(
    `${process.env.DROPI_API_URL}/v1/orders`,
    dropiOrder,
    {
      headers: {
        Authorization: `Bearer ${process.env.DROPI_API_KEY}`,
      },
    },
  );

  return response.data;
}
```

## Webhooks de Dropi

### Configurar Webhooks
1. Ir a Configuración → Webhooks
2. Agregar URL: `https://tudominio.com/api/webhooks/dropi`
3. Eventos a escuchar:
   - `order.created`
   - `order.shipped`
   - `order.delivered`
   - `product.updated`

### Implementar Endpoint de Webhook
```typescript
// En backend/src/modules/webhooks/webhooks.controller.ts

@Post('dropi')
async handleDropiWebhook(@Body() payload: any) {
  const { event, data } = payload;

  switch (event) {
    case 'order.shipped':
      await this.ordersService.updateOrderStatus(data.order_id, 'shipped');
      break;
    case 'order.delivered':
      await this.ordersService.updateOrderStatus(data.order_id, 'delivered');
      break;
    case 'product.updated':
      await this.productsService.updateProduct(data.product_id);
      break;
  }

  return { success: true };
}
```

## Manejo de Errores

### Errores Comunes
1. **API Key inválida**: Verificar credenciales
2. **Producto no disponible**: Sincronizar inventario
3. **Dirección incompleta**: Validar datos del cliente
4. **Límite de API**: Implementar rate limiting

### Reintentos
```typescript
async function retryRequest(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## Testing

### Pruebas de Integración
```bash
# Verificar conexión con Dropi
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.dropi.com/v1/products?limit=1

# Verificar webhook
curl -X POST http://localhost:3001/api/webhooks/dropi \
  -H "Content-Type: application/json" \
  -d '{"event":"order.shipped","data":{"order_id":"123"}}'
```

## Troubleshooting

### Problema: No se sincronizan productos
- Verificar API Key en `.env`
- Revisar logs del servidor
- Verificar conexión a internet
- Comprobar límites de API

### Problema: Órdenes no se crean en Dropi
- Validar estructura de datos
- Verificar disponibilidad de productos
- Revisar dirección de envío
- Comprobar saldo de cuenta en Dropi

## Documentación Oficial
- https://docs.dropi.com/api
- https://docs.dropi.com/webhooks
