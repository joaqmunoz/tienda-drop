import { DropiService } from './dropi.service';
export declare class DropiController {
    private readonly dropiService;
    constructor(dropiService: DropiService);
    getProducts(page?: number, limit?: number): Promise<any>;
    getProductById(id: string): Promise<any>;
    checkInventory(id: string): Promise<any>;
    createOrder(orderData: any): Promise<any>;
    getOrderStatus(id: string): Promise<any>;
    cancelOrder(id: string): Promise<any>;
    calculateShipping(orderData: any): Promise<any>;
    getProviders(): Promise<import("../../entities").Provider[]>;
    getProviderById(id: string): Promise<import("../../entities").Provider>;
    registerProvider(providerData: any): Promise<import("../../entities").Provider>;
}
//# sourceMappingURL=dropi.controller.d.ts.map