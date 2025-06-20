import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/Entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>
    ) {}
    

    findAll() {
        return this.productsRepository.find();
    }

    async createProduct(p) {
        return await this.productsRepository.save(p)
    }
}
