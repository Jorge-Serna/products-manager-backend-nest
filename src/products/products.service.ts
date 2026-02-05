import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductDto } from 'src/dtos/products-dtos/product-dto';
import { Repository, UpdateResult } from 'typeorm';


@Injectable()
export class ProductsService {

    private MAX_STOCK: number = 1000;
    private MIN_STOCK: number = 0;

    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>
    ) {}


    async findFilteredProducts( filters ){

        const query = this.productsRepository.createQueryBuilder('product')
        .innerJoin('product.category', 'category')
        .select([
            'product',
            'category'
        ])

        if( filters.productId ){
            query.andWhere('product.id = :i', { i: filters.productId });
        }

        if( filters.nameProduct ){
            query.andWhere('product.productName LIKE :na', { na: `%${filters.nameProduct}%`});
        }

        if( filters.description ){
            query.andWhere('product.description LIKE :descr', { descr: `%${filters.description}%`});
        }

        if( filters.category ){
            query.andWhere('category.id = :cat', { cat: filters.category });
        }

        if( filters.count){
            return await query.getManyAndCount();
        }

        return await query.getMany();
        

    } 

    async findAll() {
        return await this.productsRepository.find({
            relations: ['category'],
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

        // id is optional, so if you put it there and it does not exist already, it will be a new register
        // but if you omit it then it will use autoincrease
        if (p.id ) {
            const existsProduct = await this.findProduct(p.id);

            if( existsProduct ) {
                throw new ConflictException(`There is already an element using id: ${p.id}`);
            }
        }

        // is like creating - new Product() - from DTO
        const product = this.productsRepository.create(p);

        return await this.productsRepository.save(product)
    }
    
    async updateProduct(p) {
        return await this.productsRepository.save(p)
    }

    async deleteProductSoftly(id) {

        /*  V1
            I can use updateProduct and change the value of deleted property, but I would have to send the whole object
            and only change one property. By this method, that is going to be used, I only need the ID, then the object
            is mapped and the desired property is going to be updated only 
        */

        /*  V2 9-10-25
            I can reuse updateProduct function sending the next object, id is dynamic of course

            return await this.updateProduct( {id: Number(id), deleted:true})
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

    // el id del stock será igual al id del product
    async updateStock(s) {

        const product = await this.findProduct(s.id);

        if(!product) {
            throw new ConflictException(`Product ${s.id} does not exist`)
        }

        if(product.deleted) {
            throw new ConflictException(`Sorry! this product was deleted`)
        }

        const rows:UpdateResult = await this.productsRepository.update( 
            {id : s.id}, 
            { stock: s.stock } 
        );

        return rows.affected == 1;

    }

    async increaseStock(s) {
        const product = await this.findProduct(s.id);

        if(!product) {
            throw new ConflictException(`Product ${s.id} does not exist`)
        }

        if(product.deleted) {
            throw new ConflictException(`Sorry! this product was deleted`)
        }

        var calculatedStock = 0;

        if(s.stock + product.stock > this.MAX_STOCK) {
            calculatedStock = this.MAX_STOCK;
        } else {
            calculatedStock = s.stock + product.stock;
        }

        const rows:UpdateResult = await this.productsRepository.update( 
            {id : s.id}, 
            { stock: calculatedStock } 
        );

        return rows.affected == 1;

    }

     async decreaseStock(s) {
        const product = await this.findProduct(s.id);

        if(!product) {
            throw new ConflictException(`Product ${s.id} does not exist`)
        }

        if(product.deleted) {
            throw new ConflictException(`Sorry! this product was deleted`)
        }

        var calculatedStock = 0;

        if( product.stock - s.stock < this.MIN_STOCK) {
            calculatedStock = this.MIN_STOCK;
        } else {
            calculatedStock = product.stock - s.stock;
        }

        const rows:UpdateResult = await this.productsRepository.update( 
            {id : s.id}, 
            { stock: calculatedStock } 
        );

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
