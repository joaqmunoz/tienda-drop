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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = __importDefault(require("axios"));
const entities_1 = require("../../entities");
let ProductsService = class ProductsService {
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    async create(createProductDto) {
        const product = this.productsRepository.create(createProductDto);
        return this.productsRepository.save(product);
    }
    async findAll(query) {
        const { category, search, page = 1, limit = 20, sortBy = 'createdAt', order = 'DESC' } = query;
        const where = { isActive: true };
        if (category) {
            where.category = category;
        }
        if (search) {
            where.name = (0, typeorm_2.ILike)(`%${search}%`);
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
    async findOne(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        Object.assign(product, updateProductDto);
        return this.productsRepository.save(product);
    }
    async remove(id) {
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
    async syncProductsFromDropi() {
        try {
            console.log('🔄 Iniciando sincronización de productos desde Dropi...');
            const response = await axios_1.default.get(`${process.env.DROPI_API_URL}/v1/products`, {
                headers: {
                    Authorization: `Bearer ${process.env.DROPI_API_KEY}`,
                },
            });
            const products = response.data.products || [];
            for (const dropiProduct of products) {
                await this.syncProduct(dropiProduct);
            }
            console.log(`✅ Sincronización completada: ${products.length} productos`);
        }
        catch (error) {
            console.error('❌ Error sincronizando productos:', error.message);
        }
    }
    async syncProduct(dropiProduct) {
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
        }
        else {
            const newProduct = this.productsRepository.create(productData);
            await this.productsRepository.save(newProduct);
        }
    }
    async syncInventoryFromDropi() {
        try {
            console.log('📦 Sincronizando inventario desde Dropi...');
            const products = await this.productsRepository.find({
                where: { dropiId: (0, typeorm_2.Not)(null) },
            });
            for (const product of products) {
                try {
                    const response = await axios_1.default.get(`${process.env.DROPI_API_URL}/v1/products/${product.dropiId}`, {
                        headers: {
                            Authorization: `Bearer ${process.env.DROPI_API_KEY}`,
                        },
                    });
                    product.stock = response.data.stock;
                    await this.productsRepository.save(product);
                }
                catch (error) {
                    console.error(`Error actualizando stock para ${product.id}:`, error.message);
                }
            }
            console.log('✅ Inventario sincronizado');
        }
        catch (error) {
            console.error('❌ Error sincronizando inventario:', error.message);
        }
    }
};
exports.ProductsService = ProductsService;
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsService.prototype, "syncProductsFromDropi", null);
__decorate([
    (0, schedule_1.Cron)('*/30 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsService.prototype, "syncInventoryFromDropi", null);
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map