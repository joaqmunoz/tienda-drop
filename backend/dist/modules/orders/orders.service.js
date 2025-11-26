"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = __importDefault(require("axios"));
const entities_1 = require("../../entities");
let OrdersService = class OrdersService {
    constructor(ordersRepository, orderItemsRepository, productsRepository, usersRepository) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.productsRepository = productsRepository;
        this.usersRepository = usersRepository;
    }
    async create(userId, createOrderDto) {
        const { items, shippingAddress, notes } = createOrderDto;
        if (!items || items.length === 0) {
            throw new common_1.BadRequestException('La orden debe contener al menos un producto');
        }
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await this.productsRepository.findOne({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Producto ${item.productId} no encontrado`);
            }
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`);
            }
            const itemSubtotal = product.price * item.quantity;
            subtotal += itemSubtotal;
            const orderItem = this.orderItemsRepository.create({
                product,
                quantity: item.quantity,
                price: product.price,
                subtotal: itemSubtotal,
            });
            orderItems.push(orderItem);
        }
        const tax = subtotal * 0.1;
        const shippingCost = subtotal > 100 ? 0 : 10;
        const total = subtotal + tax + shippingCost;
        const orderNumber = `ORD-${Date.now()}`;
        const order = this.ordersRepository.create({
            orderNumber,
            user,
            items: orderItems,
            subtotal,
            tax,
            shippingCost,
            total,
            shippingAddress: shippingAddress.address,
            shippingCity: shippingAddress.city,
            shippingState: shippingAddress.state,
            shippingZip: shippingAddress.zipCode,
            shippingCountry: shippingAddress.country,
            notes,
            status: entities_1.OrderStatus.PENDING,
        });
        const savedOrder = await this.ordersRepository.save(order);
        for (const item of items) {
            const product = await this.productsRepository.findOne({
                where: { id: item.productId },
            });
            if (product) {
                product.stock -= item.quantity;
                await this.productsRepository.save(product);
            }
        }
        return savedOrder;
    }
    async findAll(userId, query) {
        const { status, page = 1, limit = 20 } = query;
        const where = { user: { id: userId } };
        if (status) {
            where.status = status;
        }
        const [orders, total] = await this.ordersRepository.findAndCount({
            where,
            relations: ['items', 'items.product'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data: orders,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }
    async findOne(id, userId) {
        const order = await this.ordersRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['items', 'items.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Orden no encontrada');
        }
        return order;
    }
    async updateStatus(id, updateOrderStatusDto) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['items', 'items.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Orden no encontrada');
        }
        order.status = updateOrderStatusDto.status;
        if (updateOrderStatusDto.trackingNumber) {
            order.trackingNumber = updateOrderStatusDto.trackingNumber;
        }
        if (updateOrderStatusDto.notes) {
            order.notes = updateOrderStatusDto.notes;
        }
        return this.ordersRepository.save(order);
    }
    async createOrderInDropi(order) {
        try {
            const dropiOrder = {
                customer: {
                    name: `${order.user.firstName} ${order.user.lastName}`,
                    email: order.user.email,
                    phone: order.user.phone,
                },
                items: order.items.map(item => ({
                    product_id: item.product.dropiId,
                    quantity: item.quantity,
                })),
                shipping_address: {
                    street: order.shippingAddress,
                    city: order.shippingCity,
                    state: order.shippingState,
                    zip: order.shippingZip,
                    country: order.shippingCountry,
                },
            };
            const response = await axios_1.default.post(`${process.env.DROPI_API_URL}/v1/orders`, dropiOrder, {
                headers: {
                    Authorization: `Bearer ${process.env.DROPI_API_KEY}`,
                },
            });
            order.dropiOrderId = response.data.id;
            order.status = entities_1.OrderStatus.PROCESSING;
            await this.ordersRepository.save(order);
            return response.data;
        }
        catch (error) {
            console.error('Error creando orden en Dropi:', error.message);
            throw new common_1.BadRequestException('Error procesando orden con Dropi');
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map