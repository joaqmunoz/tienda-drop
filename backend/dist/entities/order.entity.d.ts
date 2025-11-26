import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare class Order {
    id: string;
    orderNumber: string;
    user: User;
    userId: string;
    status: OrderStatus;
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingZip: string;
    shippingCountry: string;
    trackingNumber: string;
    dropiOrderId: string;
    stripePaymentId: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    items: OrderItem[];
}
//# sourceMappingURL=order.entity.d.ts.map