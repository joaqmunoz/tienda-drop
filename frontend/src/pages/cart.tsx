import React from 'react';
import { Layout, CartSummary } from '@/components';

export default function CartPage() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Carrito de Compras</h1>
      </div>
      <CartSummary />
    </Layout>
  );
}
