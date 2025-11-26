import { Repository } from 'typeorm';
import { Product } from '@/entities';
import { CreateProductDto, UpdateProductDto, GetProductsQueryDto } from '@/common/dtos/product.dto';
export declare class ProductsService {
    private productsRepository;
    constructor(productsRepository: Repository<Product>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(query: GetProductsQueryDto): Promise<{
        data: Product[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<Product>;
    getCategories(): Promise<any[]>;
    syncProductsFromDropi(): Promise<void>;
    private syncProduct;
    syncInventoryFromDropi(): Promise<void>;
}
//# sourceMappingURL=products.service.d.ts.map