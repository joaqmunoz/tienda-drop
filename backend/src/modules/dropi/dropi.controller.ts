import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DropiService } from './dropi.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dropi')
export class DropiController {
  constructor(private readonly dropiService: DropiService) {}

  @Get('products')
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 100,
  ) {
    return this.dropiService.getProducts(page, limit);
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return this.dropiService.getProductById(id);
  }

  @Get('products/:id/inventory')
  async checkInventory(@Param('id') id: string) {
    return this.dropiService.checkInventory(id);
  }

  @Post('orders')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() orderData: any) {
    return this.dropiService.createOrder(orderData);
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  async getOrderStatus(@Param('id') id: string) {
    return this.dropiService.getOrderStatus(id);
  }

  @Post('orders/:id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Param('id') id: string) {
    return this.dropiService.cancelOrder(id);
  }

  @Post('shipping/calculate')
  async calculateShipping(@Body() orderData: any) {
    return this.dropiService.getShippingCost(orderData);
  }

  @Get('providers')
  async getProviders() {
    return this.dropiService.getProviders();
  }

  @Get('providers/:id')
  async getProviderById(@Param('id') id: string) {
    return this.dropiService.getProviderById(id);
  }

  @Post('providers')
  @UseGuards(JwtAuthGuard)
  async registerProvider(@Body() providerData: any) {
    return this.dropiService.registerProvider(providerData);
  }
}
