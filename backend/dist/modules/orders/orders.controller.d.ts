import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, GetOrdersQueryDto } from '@/common/dtos/order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, createOrderDto: CreateOrderDto): Promise<import("../../entities").Order>;
    findAll(req: any, query: GetOrdersQueryDto): Promise<{
        data: import("../../entities").Order[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string, req: any): Promise<import("../../entities").Order>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<import("../../entities").Order>;
    createOrderInDropi(id: string): Promise<any>;
}
//# sourceMappingURL=orders.controller.d.ts.map