import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem, Product } from '@/types';

interface CartStore {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  tax: 0,
  shippingCost: 0,
  total: 0,
};

export const useCart = create<CartStore>()(
  persist(
    (set: (fn: (state: CartStore) => Partial<CartStore>) => void) => ({
      cart: initialCart,

      addToCart: (product: Product, quantity: number): void => {
        set((state: CartStore): Partial<CartStore> => {
          const existingItem = state.cart.items.find(
            (item: CartItem) => item.productId === product.id
          );

          let newItems: CartItem[];
          if (existingItem) {
            newItems = state.cart.items.map((item: CartItem) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newItems = [
              ...state.cart.items,
              { productId: product.id, quantity, product },
            ];
          }

          const subtotal = newItems.reduce(
            (sum: number, item: CartItem) => sum + (item.product?.price || 0) * item.quantity,
            0
          );

          const tax = subtotal * 0.1;
          const shippingCost = subtotal > 100 ? 0 : 10;
          const total = subtotal + tax + shippingCost;

          return {
            cart: {
              items: newItems,
              subtotal,
              tax,
              shippingCost,
              total,
            },
          };
        });
      },

      removeFromCart: (productId: string): void => {
        set((state: CartStore): Partial<CartStore> => {
          const newItems = state.cart.items.filter(
            (item: CartItem) => item.productId !== productId
          );

          const subtotal = newItems.reduce(
            (sum: number, item: CartItem) => sum + (item.product?.price || 0) * item.quantity,
            0
          );

          const tax = subtotal * 0.1;
          const shippingCost = subtotal > 100 ? 0 : 10;
          const total = subtotal + tax + shippingCost;

          return {
            cart: {
              items: newItems,
              subtotal,
              tax,
              shippingCost,
              total,
            },
          };
        });
      },

      updateQuantity: (productId: string, quantity: number): void => {
        set((state: CartStore): Partial<CartStore> => {
          const newItems = state.cart.items.map((item: CartItem) =>
            item.productId === productId ? { ...item, quantity } : item
          );

          const subtotal = newItems.reduce(
            (sum: number, item: CartItem) => sum + (item.product?.price || 0) * item.quantity,
            0
          );

          const tax = subtotal * 0.1;
          const shippingCost = subtotal > 100 ? 0 : 10;
          const total = subtotal + tax + shippingCost;

          return {
            cart: {
              items: newItems,
              subtotal,
              tax,
              shippingCost,
              total,
            },
          };
        });
      },

      clearCart: (): void => {
        set((): Partial<CartStore> => ({ cart: initialCart }));
      },

      calculateTotals: (): void => {
        set((state: CartStore): Partial<CartStore> => {
          const subtotal = state.cart.items.reduce(
            (sum: number, item: CartItem) => sum + (item.product?.price || 0) * item.quantity,
            0
          );

          const tax = subtotal * 0.1;
          const shippingCost = subtotal > 100 ? 0 : 10;
          const total = subtotal + tax + shippingCost;

          return {
            cart: {
              ...state.cart,
              subtotal,
              tax,
              shippingCost,
              total,
            },
          };
        });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
