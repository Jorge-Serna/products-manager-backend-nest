import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() p:any) {
    return this.productsService.createProduct(p);
  }

  @Get()
  findAll() {
    return this.productsService.findAll()
  }
}
