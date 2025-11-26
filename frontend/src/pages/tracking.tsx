import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layout } from '@/components';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface TrackingInfo {
  trackingNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  currentLocation?: string;
  estimatedDelivery?: string;
  lastUpdate?: string;
  events: Array<{
    timestamp: string;
    status: string;
    location?: string;
    description: string;
  }>;
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast.error('Por favor ingresa un número de seguimiento');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await api.get(`/orders/tracking/${trackingNumber}`);
      setTrackingInfo(response.data);
      toast.success('Información de seguimiento cargada');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'No se encontró el seguimiento';
      setError(errorMessage);
      toast.error(errorMessage);
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Seguimiento de Envío</h1>
          <p className="text-gray-600">Ingresa tu número de seguimiento para ver el estado en tiempo real</p>
        </div>

        {/* Formulario de búsqueda */}
        <div className="card mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Ej: DROPI-2024-001234"
              className="input flex-1"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'Buscando...' : 'Rastrear'}
            </button>
          </form>
        </div>

        {/* Resultados */}
        {error && !trackingInfo && (
          <div className="card bg-red-50 border border-red-200">
            <p className="text-red-800">{error}</p>
            <p className="text-sm text-red-600 mt-2">
              Si tienes una orden, puedes verla en{' '}
              <Link href="/orders" className="underline font-bold">
                Mis Órdenes
              </Link>
            </p>
          </div>
        )}

        {trackingInfo && (
          <div className="space-y-6">
            {/* Información principal */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-600">Número de Seguimiento</p>
                  <p className="text-2xl font-bold font-mono">{trackingInfo.trackingNumber}</p>
                </div>
                <div className="text-right">
                  <span className={`badge px-4 py-2 rounded-full text-lg ${getStatusColor(trackingInfo.status)}`}>
                    {getStatusIcon(trackingInfo.status)} {getStatusLabel(trackingInfo.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trackingInfo.currentLocation && (
                  <div>
                    <p className="text-sm text-gray-600">Ubicación Actual</p>
                    <p className="text-lg font-medium">{trackingInfo.currentLocation}</p>
                  </div>
                )}
                {trackingInfo.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-gray-600">Entrega Estimada</p>
                    <p className="text-lg font-medium">
                      {new Date(trackingInfo.estimatedDelivery).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
                {trackingInfo.lastUpdate && (
                  <div>
                    <p className="text-sm text-gray-600">Última Actualización</p>
                    <p className="text-lg font-medium">
                      {new Date(trackingInfo.lastUpdate).toLocaleString('es-ES')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline de eventos */}
            <div className="card">
              <h3 className="text-2xl font-bold mb-6">Historial de Seguimiento</h3>

              {trackingInfo.events && trackingInfo.events.length > 0 ? (
                <div className="space-y-4">
                  {trackingInfo.events.map((event, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        {idx < trackingInfo.events.length - 1 && (
                          <div className="w-1 h-12 bg-blue-200 my-2"></div>
                        )}
                      </div>

                      <div className="flex-1 pb-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-lg">{event.status}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(event.timestamp).toLocaleString('es-ES')}
                            </p>
                          </div>
                          <p className="text-gray-700">{event.description}</p>
                          {event.location && (
                            <p className="text-sm text-gray-600 mt-2">📍 {event.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No hay eventos registrados aún</p>
              )}
            </div>

            {/* Información adicional */}
            <div className="card bg-blue-50">
              <h4 className="font-bold mb-3">💡 Información Útil</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Actualizamos el estado cada 30 minutos</li>
                <li>✓ Recibirás notificaciones por email en cada cambio de estado</li>
                <li>✓ Si tienes problemas, contacta a nuestro equipo de soporte</li>
                <li>✓ Los tiempos de entrega pueden variar según tu ubicación</li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setTrackingNumber('');
                  setTrackingInfo(null);
                }}
                className="btn btn-secondary flex-1"
              >
                Buscar Otro
              </button>
              <Link href="/orders" className="btn btn-primary flex-1 text-center">
                Ver Mis Órdenes
              </Link>
            </div>
          </div>
        )}

        {/* Información general */}
        {!trackingInfo && !error && (
          <div className="card bg-gray-50">
            <h3 className="text-xl font-bold mb-4">¿Cómo funciona el seguimiento?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-3xl mb-2">📦</p>
                <p className="font-bold mb-2">1. Ingresa tu número</p>
                <p className="text-sm text-gray-600">
                  Usa el número de seguimiento de tu correo de confirmación
                </p>
              </div>
              <div>
                <p className="text-3xl mb-2">🔍</p>
                <p className="font-bold mb-2">2. Obtén actualizaciones</p>
                <p className="text-sm text-gray-600">
                  Recibe información en tiempo real del estado de tu envío
                </p>
              </div>
              <div>
                <p className="text-3xl mb-2">✅</p>
                <p className="font-bold mb-2">3. Recibe tu pedido</p>
                <p className="text-sm text-gray-600">
                  Sigue el envío hasta que llegue a tu puerta
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
