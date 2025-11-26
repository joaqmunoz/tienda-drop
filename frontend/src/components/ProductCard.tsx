import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/lib/useCart';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (): Promise<void> => {
    setIsAdding(true);
    try {
      addToCart(product, quantity);
      toast.success(`${product.name} agregado al carrito`);
      setQuantity(1);
    } catch (error: unknown) {
      toast.error('Error al agregar al carrito');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-4xl">📦</span>
          </div>
        )}

        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Agotado</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        {/* Category Badge */}
        {product.category && (
          <span className="badge badge-info text-xs mb-2 w-fit">
            {product.category}
          </span>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-bold hover:text-blue-600 transition cursor-pointer mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">({product.reviews} reseñas)</span>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          {product.costPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ${product.costPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Info */}
        <p className="text-sm text-gray-600 mb-4">
          {product.stock > 0 ? (
            <span className="text-green-600 font-medium">
              {product.stock} en stock
            </span>
          ) : (
            <span className="text-red-600 font-medium">No disponible</span>
          )}
        </p>

        {/* Add to Cart */}
        {product.stock > 0 && (
          <div className="flex gap-2 mt-auto">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="input w-16"
            />
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="btn btn-primary flex-1"
            >
              {isAdding ? 'Agregando...' : 'Agregar al Carrito'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
