import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components';
import { Product } from '@/types';
import { useAuth } from '@/lib/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/products', {
          params: { limit: 8, sortBy: 'rating' },
        });
        setFeaturedProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Error al cargar productos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Section - Elegante y Moderno */}
      <section className="mb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 px-6 md:px-12 py-16 md:py-20 text-center">
            {isAuthenticated && user && (
              <p className="text-emerald-400 font-semibold mb-4 text-sm md:text-base">
                ¡Bienvenido de vuelta, {(user as any)?.name || 'Cliente'}! 👋
              </p>
            )}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Compra Premium
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                Con Estilo
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Descubre nuestra colección exclusiva de productos seleccionados con envíos rápidos y seguros
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 text-lg px-8 py-3 rounded-lg font-semibold transition-all">
                Explorar Ahora
              </Link>
              {!isAuthenticated && (
                <Link href="/login" className="btn bg-slate-700 text-white hover:bg-slate-600 text-lg px-8 py-3 rounded-lg font-semibold transition-all">
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { number: '50K+', label: 'Productos' },
            { number: '100K+', label: 'Clientes' },
            { number: '24/7', label: 'Soporte' },
            { number: '3-5', label: 'Días Entrega' },
          ].map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <p className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">{stat.number}</p>
              <p className="text-slate-600 font-medium text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - Elegante */}
      <section className="mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">
          ¿Por qué elegirnos?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🚀',
              title: 'Envío Ultrarrápido',
              description: 'Entrega en 3-5 días hábiles con seguimiento en tiempo real',
              color: 'from-blue-500 to-blue-600',
            },
            {
              icon: '🔒',
              title: 'Pago 100% Seguro',
              description: 'Encriptación SSL y múltiples métodos de pago verificados',
              color: 'from-emerald-500 to-emerald-600',
            },
            {
              icon: '✨',
              title: 'Garantía Total',
              description: '30 días para devolver sin preguntas y satisfacción garantizada',
              color: 'from-purple-500 to-purple-600',
            },
          ].map((feature, index) => (
            <div key={index} className={`bg-gradient-to-br ${feature.color} rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}>
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/90">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mb-20">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Productos Destacados
          </h2>
          <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2">
            Ver todos →
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
            <p className="text-slate-600 mt-4">Cargando productos premium...</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer h-full flex flex-col">
                  <div className="relative w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl">📦</span>
                      </div>
                    )}
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Agotado</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {product.name}
                    </h3>
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1 mb-3">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm font-medium text-slate-600">{product.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="mt-auto">
                      <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.costPrice && (
                        <p className="text-sm text-slate-500 line-through">
                          ${product.costPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-600 text-lg">No hay productos disponibles en este momento</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="mb-20">
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para comprar?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Únete a miles de clientes satisfechos y disfruta de nuestras ofertas exclusivas
          </p>
          <Link href="/products" className="btn bg-white text-emerald-600 hover:bg-slate-100 text-lg px-8 py-3 rounded-lg font-semibold transition-all">
            Comenzar Compra
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section>
        <div className="bg-slate-50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">
            Recibe Ofertas Exclusivas
          </h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Suscríbete a nuestro newsletter y obtén descuentos especiales
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="btn bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 px-6 py-3 rounded-lg font-semibold transition-all">
              Suscribir
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
