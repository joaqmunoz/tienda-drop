export declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class ShippingAddressDto {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    shippingAddress: ShippingAddressDto;
    notes?: string;
}
export declare class UpdateOrderStatusDto {
    status: string;
    trackingNumber?: string;
    notes?: string;
}
export declare class GetOrdersQueryDto {
    status?: string;
    page?: number;
    limit?: number;
}
//# sourceMappingURL=order.dto.d.ts.map