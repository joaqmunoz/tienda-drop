import { OrderItem } from './order-item.entity';
export declare class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    costPrice: number;
    stock: number;
    sku: string;
    dropiId: string;
    provider: string;
    image: string;
    images: string[];
    category: string;
    rating: number;
    reviews: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    orderItems: OrderItem[];
}
//# sourceMappingURL=product.entity.d.ts.map