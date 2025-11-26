import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout } from '@/components';
import { useAuth } from '@/lib/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data.data || []);
    } catch (error) {
      toast.error('Error al cargar órdenes');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      processing: 'Procesando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '⚙️';
      case 'shipped':
        return '📦';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Cargando órdenes...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mis Órdenes</h1>
          <p className="text-gray-600">Aquí puedes ver el estado de tus compras</p>
        </div>

        {orders.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-2xl mb-4">📭</p>
            <p className="text-xl text-gray-600 mb-6">No tienes órdenes aún</p>
            <Link href="/products" className="btn btn-primary">
              Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-2xl">{getStatusIcon(order.status)}</span>
                      <div>
                        <p className="text-sm text-gray-600">Orden #{order.orderNumber}</p>
                        <p className="font-bold text-lg">
                          {new Date(order.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`badge px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Detalles expandibles */}
                {selectedOrder?.id === order.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Productos */}
                      <div>
                        <h4 className="font-bold mb-3">Productos</h4>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.productName} x{item.quantity}</span>
                              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Seguimiento */}
                      <div>
                        <h4 className="font-bold mb-3">Información de Entrega</h4>
                        <div className="space-y-2">
                          {order.trackingNumber && (
                            <div>
                              <p className="text-sm text-gray-600">Número de Seguimiento</p>
                              <p className="font-mono bg-gray-100 p-2 rounded">
                                {order.trackingNumber}
                              </p>
                            </div>
                          )}
                          {order.estimatedDelivery && (
                            <div>
                              <p className="text-sm text-gray-600">Entrega Estimada</p>
                              <p className="font-bold">
                                {new Date(order.estimatedDelivery).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Timeline de estado */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-bold mb-4">Estado del Envío</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                            ✓
                          </div>
                          <div>
                            <p className="font-medium">Orden Confirmada</p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-3 ${
                            ['processing', 'shipped', 'delivered'].includes(order.status)
                              ? 'opacity-100'
                              : 'opacity-50'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                              ['processing', 'shipped', 'delivered'].includes(order.status)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            ⚙️
                          </div>
                          <div>
                            <p className="font-medium">Procesando</p>
                            <p className="text-sm text-gray-600">En preparación</p>
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-3 ${
                            ['shipped', 'delivered'].includes(order.status)
                              ? 'opacity-100'
                              : 'opacity-50'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                              ['shipped', 'delivered'].includes(order.status)
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            📦
                          </div>
                          <div>
                            <p className="font-medium">Enviado</p>
                            <p className="text-sm text-gray-600">En tránsito</p>
                          </div>
                        </div>

                        <div
                          className={`flex items-center gap-3 ${
                            order.status === 'delivered' ? 'opacity-100' : 'opacity-50'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                              order.status === 'delivered'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            ✓
                          </div>
                          <div>
                            <p className="font-medium">Entregado</p>
                            <p className="text-sm text-gray-600">Completado</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
