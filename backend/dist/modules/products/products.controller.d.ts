import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, GetProductsQueryDto } from '@/common/dtos/product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<import("../../entities").Product>;
    findAll(query: GetProductsQueryDto): Promise<{
        data: import("../../entities").Product[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    getCategories(): Promise<any[]>;
    findOne(id: string): Promise<import("../../entities").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("../../entities").Product>;
    remove(id: string): Promise<import("../../entities").Product>;
}
//# sourceMappingURL=products.controller.d.ts.map