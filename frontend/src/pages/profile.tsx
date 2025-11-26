import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components';
import { useAuth } from '@/lib/useAuth';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Perfil actualizado exitosamente');
      setIsEditing(false);
    } catch (error) {
      toast.error('Error al actualizar perfil');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada');
    router.push('/');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="card">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl text-white">👤</span>
                </div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-primary w-full"
                >
                  {isEditing ? 'Cancelar' : 'Editar Perfil'}
                </button>
                <button
                  onClick={() => router.push('/orders')}
                  className="btn btn-secondary w-full"
                >
                  Mis Órdenes
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger w-full"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {isEditing ? (
              <div className="card">
                <h3 className="text-2xl font-bold mb-6">Editar Perfil</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Teléfono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Dirección</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="input"
                      rows={4}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full"
                  >
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-2xl font-bold mb-6">Información Personal</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">Nombre</label>
                      <p className="text-lg font-medium">{user?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="text-lg font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Teléfono</label>
                      <p className="text-lg font-medium">{user?.phone || 'No especificado'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Dirección</label>
                      <p className="text-lg font-medium">{user?.address || 'No especificada'}</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-2xl font-bold mb-6">Estadísticas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Total de Órdenes</p>
                      <p className="text-3xl font-bold text-blue-600">0</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Gasto Total</p>
                      <p className="text-3xl font-bold text-green-600">$0.00</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
