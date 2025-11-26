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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropiController = void 0;
const common_1 = require("@nestjs/common");
const dropi_service_1 = require("./dropi.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let DropiController = class DropiController {
    constructor(dropiService) {
        this.dropiService = dropiService;
    }
    async getProducts(page = 1, limit = 100) {
        return this.dropiService.getProducts(page, limit);
    }
    async getProductById(id) {
        return this.dropiService.getProductById(id);
    }
    async checkInventory(id) {
        return this.dropiService.checkInventory(id);
    }
    async createOrder(orderData) {
        return this.dropiService.createOrder(orderData);
    }
    async getOrderStatus(id) {
        return this.dropiService.getOrderStatus(id);
    }
    async cancelOrder(id) {
        return this.dropiService.cancelOrder(id);
    }
    async calculateShipping(orderData) {
        return this.dropiService.getShippingCost(orderData);
    }
    async getProviders() {
        return this.dropiService.getProviders();
    }
    async getProviderById(id) {
        return this.dropiService.getProviderById(id);
    }
    async registerProvider(providerData) {
        return this.dropiService.registerProvider(providerData);
    }
};
exports.DropiController = DropiController;
__decorate([
    (0, common_1.Get)('products'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], DropiController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DropiController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Get)('products/:id/inventory'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DropiController.prototype, "checkInventory", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DropiController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DropiController.prototype, "getOrderStatus", null);
__decorate([
    (0, common_1.Post)('orders/:id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DropiController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Post)('shipping/calculate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DropiController.prototype, "calculateShipping", null);
__decorate([
    (0, common_1.Get)('providers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DropiController.prototype, "getProviders", null);
__decorate([
    (0, common_1.Get)('providers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DropiController.prototype, "getProviderById", null);
__decorate([
    (0, common_1.Post)('providers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DropiController.prototype, "registerProvider", null);
exports.DropiController = DropiController = __decorate([
    (0, common_1.Controller)('dropi'),
    __metadata("design:paramtypes", [dropi_service_1.DropiService])
], DropiController);
//# sourceMappingURL=dropi.controller.js.map