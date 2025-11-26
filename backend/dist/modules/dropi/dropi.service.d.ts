import { Repository } from 'typeorm';
import { Provider } from '@/entities';
export declare class DropiService {
    private providersRepository;
    private dropiClient;
    constructor(providersRepository: Repository<Provider>);
    private initializeDropiClient;
    getProducts(page?: number, limit?: number): Promise<any>;
    getProductById(productId: string): Promise<any>;
    checkInventory(productId: string): Promise<any>;
    createOrder(orderData: any): Promise<any>;
    getOrderStatus(orderId: string): Promise<any>;
    cancelOrder(orderId: string): Promise<any>;
    getShippingCost(orderData: any): Promise<any>;
    registerProvider(providerData: any): Promise<Provider>;
    getProviders(): Promise<Provider[]>;
    getProviderById(id: string): Promise<Provider>;
}
//# sourceMappingURL=dropi.service.d.ts.map