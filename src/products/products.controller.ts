import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from 'src/entities/product.entity';
import { ProductDto } from 'src/dtos/products-dtos/product-dto';
import { StockDto } from 'src/dtos/products-dtos/stock-dto';

@Controller('products')
export class ProductsController {

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() p:ProductDto) {
    return this.productsService.createProduct( p );
  }

  // Those that have a specific route go first, otherwise the app would think it is an argunment and take the next method
  // the more specific route, the upper position it takes
  @Get('/deleted')
  findDeletedProducts() {
    return this.productsService.findDeletedProducts();
  }

  @Get('/:id')
  findProduct(@Param('id') id) {
    return this.productsService.findProduct(id);
  }

  @Get()
  findAllProducts() {
    return this.productsService.findAll();
  }

  @Put()
  updateProduct(@Body() p:ProductDto){
    return this.productsService.updateProduct( p );
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id) {
    return this.productsService.deleteProductSoftly( id );
  }


  @Post('/filtered')
  findFilteredProducts( @Body() p:any ) {
    return this.productsService.findFilteredProducts( p );
  }
  

  @Patch('/restore/:id')
  restoreProduct(@Param('id') id) {
    return this.productsService.restoreProduct( id );
  }

  @Patch('/stock')
  updateStock(@Body() stock: StockDto) {
    return this.productsService.updateStock( stock );
  }

  @Patch('/increase-stock')
  increaseStock(@Body() stock: StockDto) {
    return this.productsService.increaseStock( stock );
  }

  @Patch('/decrease-stock')
  decreaseStock(@Body() stock: StockDto) {
    return this.productsService.decreaseStock( stock );
  }

  
}
