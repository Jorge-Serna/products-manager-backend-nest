import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from 'src/Entities/product.entity';

@Controller('products')
export class ProductsController {

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() p:Product) {
    console.log(p)
    return this.productsService.createProduct(p);
  }

  @Get()
  findAll() {
    return this.productsService.findAll()
  }
}
