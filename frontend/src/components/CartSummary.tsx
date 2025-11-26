import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/useCart';

export const CartSummary: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-2xl mb-4">🛒</p>
        <p className="text-gray-600 mb-6">Tu carrito está vacío</p>
        <Link href="/products" className="btn btn-primary">
          Continuar Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Carrito de Compras</h2>

          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 pb-4 border-b last:border-b-0"
              >
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  {item.product?.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      📦
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="font-bold hover:text-blue-600 transition cursor-pointer">
                      {item.product?.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm">
                    ${item.product?.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                    }
                    className="btn btn-secondary w-8 h-8 p-0"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.productId,
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    className="input w-12 text-center"
                  />
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="btn btn-secondary w-8 h-8 p-0"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="font-bold">
                    ${(item.product?.price || 0 * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-600 hover:text-red-800 text-sm mt-2"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="card sticky top-4">
          <h3 className="text-xl font-bold mb-6">Resumen del Pedido</h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Impuestos (10%):</span>
              <span className="font-medium">${cart.tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Envío:</span>
              <span className="font-medium">
                {cart.shippingCost === 0 ? (
                  <span className="text-green-600">Gratis</span>
                ) : (
                  `$${cart.shippingCost.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="border-t pt-3 flex justify-between">
              <span className="font-bold text-lg">Total:</span>
              <span className="font-bold text-lg text-blue-600">
                ${cart.total.toFixed(2)}
              </span>
            </div>
          </div>

          <Link href="/checkout" className="btn btn-primary w-full mb-3">
            Proceder al Pago
          </Link>

          <Link href="/products" className="btn btn-secondary w-full">
            Continuar Comprando
          </Link>

          {/* Shipping Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded text-sm text-gray-600">
            <p className="mb-2">
              ✓ Envío gratis en compras mayores a $100
            </p>
            <p>
              ✓ Entrega en 3-5 días hábiles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
