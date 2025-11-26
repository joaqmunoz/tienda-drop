import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosInstance } from 'axios';
import { Provider } from '@/entities';

@Injectable()
export class DropiService {
  private dropiClient: AxiosInstance;

  constructor(
    @InjectRepository(Provider)
    private providersRepository: Repository<Provider>,
  ) {
    this.initializeDropiClient();
  }

  private initializeDropiClient() {
    this.dropiClient = axios.create({
      baseURL: process.env.DROPI_API_URL || 'https://api.dropi.com',
      headers: {
        Authorization: `Bearer ${process.env.DROPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getProducts(page: number = 1, limit: number = 100) {
    try {
      const response = await this.dropiClient.get('/v1/products', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw new BadRequestException('Error obteniendo productos de Dropi');
    }
  }

  async getProductById(productId: string) {
    try {
      const response = await this.dropiClient.get(`/v1/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new BadRequestException('Error obteniendo producto de Dropi');
    }
  }

  async checkInventory(productId: string) {
    try {
      const response = await this.dropiClient.get(
        `/v1/products/${productId}/inventory`,
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException('Error verificando inventario en Dropi');
    }
  }

  async createOrder(orderData: any) {
    try {
      const response = await this.dropiClient.post('/v1/orders', orderData);
      return response.data;
    } catch (error) {
      throw new BadRequestException('Error creando orden en Dropi');
    }
  }

  async getOrderStatus(orderId: string) {
    try {
      const response = await this.dropiClient.get(`/v1/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw new BadRequestException('Error obteniendo estado de orden en Dropi');
    }
  }

  async cancelOrder(orderId: string) {
    try {
      const response = await this.dropiClient.post(
        `/v1/orders/${orderId}/cancel`,
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException('Error cancelando orden en Dropi');
    }
  }

  async getShippingCost(orderData: any) {
    try {
      const response = await this.dropiClient.post(
        '/v1/shipping/calculate',
        orderData,
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException('Error calculando costo de envío');
    }
  }

  async registerProvider(providerData: any) {
    const provider = this.providersRepository.create({
      name: providerData.name,
      description: providerData.description,
      apiUrl: providerData.apiUrl,
      apiKey: providerData.apiKey,
      apiSecret: providerData.apiSecret,
      syncInterval: providerData.syncInterval || 60,
    });

    return this.providersRepository.save(provider);
  }

  async getProviders() {
    return this.providersRepository.find({
      where: { isActive: true },
    });
  }

  async getProviderById(id: string) {
    return this.providersRepository.findOne({
      where: { id },
    });
  }
}
