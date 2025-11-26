import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Not } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { Product } from '@/entities';
import { CreateProductDto, UpdateProductDto, GetProductsQueryDto } from '@/common/dtos/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(query: GetProductsQueryDto) {
    const { category, search, page = 1, limit = 20, sortBy = 'createdAt', order = 'DESC' } = query;

    const where: any = { isActive: true };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [products, total] = await this.productsRepository.findAndCount({
      where,
      order: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: products,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    product.isActive = false;
    return this.productsRepository.save(product);
  }

  async getCategories() {
    const categories = await this.productsRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .where('product.isActive = true')
      .getRawMany();

    return categories.map(c => c.category).filter(c => c);
  }

  // Sincronización con Dropi
  @Cron('0 * * * *') // Cada hora
  async syncProductsFromDropi() {
    try {
      console.log('🔄 Iniciando sincronización de productos desde Dropi...');

      const response = await axios.get(
        `${process.env.DROPI_API_URL}/v1/products`,
        {
          headers: {
            Authorization: `Bearer ${process.env.DROPI_API_KEY}`,
          },
        },
      );

      const products = response.data.products || [];

      for (const dropiProduct of products) {
        await this.syncProduct(dropiProduct);
      }

      console.log(`✅ Sincronización completada: ${products.length} productos`);
    } catch (error) {
      console.error('❌ Error sincronizando productos:', error.message);
    }
  }

  private async syncProduct(dropiProduct: any) {
    const existingProduct = await this.productsRepository.findOne({
      where: { dropiId: dropiProduct.id },
    });

    const productData = {
      name: dropiProduct.name,
      description: dropiProduct.description,
      price: dropiProduct.price,
      costPrice: dropiProduct.cost_price,
      stock: dropiProduct.stock,
      sku: dropiProduct.sku,
      dropiId: dropiProduct.id,
      provider: 'dropi',
      image: dropiProduct.image,
      images: dropiProduct.images,
      category: dropiProduct.category,
    };

    if (existingProduct) {
      Object.assign(existingProduct, productData);
      await this.productsRepository.save(existingProduct);
    } else {
      const newProduct = this.productsRepository.create(productData);
      await this.productsRepository.save(newProduct);
    }
  }

  // Sincronización de inventario
  @Cron('*/30 * * * *') // Cada 30 minutos
  async syncInventoryFromDropi() {
    try {
      console.log('📦 Sincronizando inventario desde Dropi...');

      const products = await this.productsRepository.find({
        where: { dropiId: Not(null) },
      });

      for (const product of products) {
        try {
          const response = await axios.get(
            `${process.env.DROPI_API_URL}/v1/products/${product.dropiId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.DROPI_API_KEY}`,
              },
            },
          );

          product.stock = response.data.stock;
          await this.productsRepository.save(product);
        } catch (error) {
          console.error(`Error actualizando stock para ${product.id}:`, error.message);
        }
      }

      console.log('✅ Inventario sincronizado');
    } catch (error) {
      console.error('❌ Error sincronizando inventario:', error.message);
    }
  }
}
