export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    costPrice?: number;
    stock: number;
    sku?: string;
    dropiId?: string;
    provider?: string;
    image?: string;
    images?: string[];
    category?: string;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    costPrice?: number;
    stock?: number;
    category?: string;
}
export declare class GetProductsQueryDto {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
}
//# sourceMappingURL=product.dto.d.ts.map