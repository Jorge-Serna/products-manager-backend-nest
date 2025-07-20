import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductDto } from 'src/dtos/products-dto/product-dto';
import { Repository, UpdateResult } from 'typeorm';


@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>
    ) {}
    

    async findAll() {
        return await this.productsRepository.find({

            where: { deleted: false }

        });
    }

    async findDeletedProducts() {
        return await this.productsRepository.find({
            where: { deleted: true }
        });
    }

    async findProduct(id) {
        return await this.productsRepository.findOne({
            where: { id }
        })
    }

    async createProduct(p: ProductDto) {

        if(p.id) {
            const existsProduct = await this.findProduct(p.id);

            if(existsProduct) {
                throw new ConflictException(`There is already an element using the id: ${p.id}`);
            }
        }

        return await this.productsRepository.save(p)
    }
    
    async updateProduct(p) {
        return await this.productsRepository.save(p)
    }

    async deleteProductSoftly(id) {

        /*  
            I can use updateProduct and change the value of deleted property, but I would have to send the whole object
            and only change one property, by this method, that is going to be used, I only need the ID, then the object
            is mapped and the desired property is going to be updated only 
        */


        const product = await this.findProduct(id)

        if(!product) {
            throw new ConflictException(`Product with ID ${id} does not exist, so it cannot be deleted`);
        }

        if(product.deleted) {
            throw new ConflictException(`Product with ID ${id} has been deleted before`);
        }

        // Not our update, but from TypeORM repository
        // it maps the product by the id (first arg), then applies second arg update, as long as the property exists
        const rows:UpdateResult = await this.productsRepository.update( {id}, { deleted: true } );

        return rows.affected == 1;

    }

    async restoreProduct(id) {

        const product = await this.findProduct(id)

        if(!product) {
            throw new ConflictException(`Product with ID ${id} does not exist, so it cannot be deleted`);
        }

        if(!product.deleted) {
            throw new ConflictException(`Product with ID ${id} hasn't been deleted`);
        }

        // Not our update, but from TypeORM repository
        // it maps the product by the id (first arg), then applies second arg update, as long as the property exists
        const rows:UpdateResult = await this.productsRepository.update( {id}, { deleted: false } );

        return rows.affected == 1;

    }




    // findEncodedPass(salt, password) {

    //     var salted = `${password}{${salt}}`;

	// 	var x:any = '';
	// 	for (var i =1; i <= 5000; i++) {
	// 		x = crypto.createHash('sha512').update(x+salted).digest();
	// 	}
	// 	return Buffer.from(x).toString('base64');

    // }





}
