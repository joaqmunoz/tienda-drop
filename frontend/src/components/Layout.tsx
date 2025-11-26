import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import { useCart } from '@/lib/useCart';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();

  const cartItemsCount = cart.items.length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold hover:opacity-80 transition">
              🛍️ E-Commerce Dropi
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link href="/products" className="hover:opacity-80 transition">
                Productos
              </Link>

              {isAuthenticated ? (
                <>
                  <Link href="/orders" className="hover:opacity-80 transition">
                    Mis Pedidos
                  </Link>
                  <Link href="/profile" className="hover:opacity-80 transition">
                    {user?.firstName}
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:opacity-80 transition">
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/register"
                    className="bg-secondary hover:bg-blue-700 px-4 py-2 rounded transition"
                  >
                    Registrarse
                  </Link>
                </>
              )}

              {/* Cart Icon */}
              <Link href="/cart" className="relative hover:opacity-80 transition">
                <span className="text-2xl">🛒</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold mb-4">Sobre Nosotros</h3>
              <p className="text-gray-400">
                Tu tienda en línea confiable con productos de calidad y envíos rápidos.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/products" className="hover:text-white transition">
                    Productos
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    Acerca de
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-bold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/faq" className="hover:text-white transition">
                    Preguntas Frecuentes
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white transition">
                    Envíos
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white transition">
                    Devoluciones
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contacto</h3>
              <p className="text-gray-400 mb-2">📧 info@ecommerce.com</p>
              <p className="text-gray-400 mb-2">📞 +34 123 456 789</p>
              <p className="text-gray-400">🕐 Lun-Vie: 9:00 - 18:00</p>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 E-Commerce Dropi. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
