import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDto } from 'src/dtos/categories-dtos/category-dto';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {


    constructor(

        @InjectRepository(Category)
        private readonly catRepository: Repository<Category>

    ) {}

    async findCategory(id) {
        return await this.catRepository.findOne({
            where: { id }
        })
    }

    async findAll(){
        return await this.catRepository.find();
    }

    async createCategory(cat: CategoryDto) {
        // id is optional, so if you put it there and it does not exist already, it will be a new register
        // but if you omit it then it will use autoincrease
        if(cat.id) {
            const existsCategory = await this.findCategory(cat.id);

            if(existsCategory) {
                throw new ConflictException(`There is already an element using id: ${cat.id}`);
            }
        }

        return await this.catRepository.save(cat)
    }
}
