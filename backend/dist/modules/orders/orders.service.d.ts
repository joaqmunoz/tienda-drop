import { Repository } from 'typeorm';
import { Order, OrderItem, Product, User } from '@/entities';
import { CreateOrderDto, UpdateOrderStatusDto, GetOrdersQueryDto } from '@/common/dtos/order.dto';
export declare class OrdersService {
    private ordersRepository;
    private orderItemsRepository;
    private productsRepository;
    private usersRepository;
    constructor(ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, productsRepository: Repository<Product>, usersRepository: Repository<User>);
    create(userId: string, createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(userId: string, query: GetOrdersQueryDto): Promise<{
        data: Order[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string, userId: string): Promise<Order>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order>;
    createOrderInDropi(order: Order): Promise<any>;
}
//# sourceMappingURL=orders.service.d.ts.map