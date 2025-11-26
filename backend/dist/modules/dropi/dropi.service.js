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
exports.DropiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = __importDefault(require("axios"));
const entities_1 = require("../../entities");
let DropiService = class DropiService {
    constructor(providersRepository) {
        this.providersRepository = providersRepository;
        this.initializeDropiClient();
    }
    initializeDropiClient() {
        this.dropiClient = axios_1.default.create({
            baseURL: process.env.DROPI_API_URL || 'https://api.dropi.com',
            headers: {
                Authorization: `Bearer ${process.env.DROPI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
    }
    async getProducts(page = 1, limit = 100) {
        try {
            const response = await this.dropiClient.get('/v1/products', {
                params: { page, limit },
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException('Error obteniendo productos de Dropi');
        }
    }
    async getProductById(productId) {
        try {
            const response = await this.dropiClient.get(`/v1/products/${productId}`);
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException('Error obteniendo producto de Dropi');
        }
    }
    async checkInventory(productId) {
        try {
            const response = await this.dropiClient.get(`/v1/products/${productId}/inventory`);
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException('Error verificando inventario en Dropi');
        }
    }
    async createOrder(orderData) {
        try {
            const response = await this.dropiClient.post('/v1/orders', orderData);
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException('Error creando orden en Dropi');
        }
    }
    async getOrderStatus(orderId) {
        try {
            const response = await this.dropiClient.get(`/v1/orders/${orderId}`);
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException('Error obteniendo estado de orden en Dropi');
        }
    }
    async cancelOrder(orderId) {
        try {
            const response = await this.dropiClient.post(`/v1/orders/${orderId}/cancel`);
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException('Error cancelando orden en Dropi');
        }
    }
    async getShippingCost(orderData) {
        try {
            const response = await this.dropiClient.post('/v1/shipping/calculate', orderData);
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException('Error calculando costo de envío');
        }
    }
    async registerProvider(providerData) {
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
    async getProviderById(id) {
        return this.providersRepository.findOne({
            where: { id },
        });
    }
};
exports.DropiService = DropiService;
exports.DropiService = DropiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Provider)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DropiService);
//# sourceMappingURL=dropi.service.js.map