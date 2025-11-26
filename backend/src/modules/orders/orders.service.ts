import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Order, OrderItem, OrderStatus, Product, User } from '@/entities';
import { CreateOrderDto, UpdateOrderStatusDto, GetOrdersQueryDto } from '@/common/dtos/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { items, shippingAddress, notes } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('La orden debe contener al menos un producto');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    let subtotal = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productsRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Producto ${item.productId} no encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`,
        );
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
      status: OrderStatus.PENDING,
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

  async findAll(userId: string, query: GetOrdersQueryDto) {
    const { status, page = 1, limit = 20 } = query;
    const where: any = { user: { id: userId } };
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

  async findOne(id: string, userId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }
    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }
    order.status = updateOrderStatusDto.status as OrderStatus;
    if (updateOrderStatusDto.trackingNumber) {
      order.trackingNumber = updateOrderStatusDto.trackingNumber;
    }
    if (updateOrderStatusDto.notes) {
      order.notes = updateOrderStatusDto.notes;
    }
    return this.ordersRepository.save(order);
  }

  async createOrderInDropi(order: Order) {
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
      const response = await axios.post(
        `${process.env.DROPI_API_URL}/v1/orders`,
        dropiOrder,
        {
          headers: {
            Authorization: `Bearer ${process.env.DROPI_API_KEY}`,
          },
        },
      );
      order.dropiOrderId = response.data.id;
      order.status = OrderStatus.PROCESSING;
      await this.ordersRepository.save(order);
      return response.data;
    } catch (error) {
      console.error('Error creando orden en Dropi:', error.message);
      throw new BadRequestException('Error procesando orden con Dropi');
    }
  }
}
