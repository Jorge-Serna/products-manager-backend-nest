import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryDto } from 'src/dtos/categories-dtos/category-dto';

@Controller('categories')
export class CategoriesController {

    constructor( private catService: CategoriesService){};

    @Get()
    findAllProducts() {
    return this.catService.findAll();
    }

    @Post()
    createCategory(@Body() cat: CategoryDto) {
        return this.catService.createCategory(cat);
    }
}
