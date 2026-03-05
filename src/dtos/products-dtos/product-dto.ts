import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Category } from "src/entities/category.entity";

export class ProductDto {

    // Para que funcionen los decoradores - validadores me instalé npm i class-validators

    @IsOptional()
    @IsNumber()
    @IsPositive()
    id: number;

    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsNotEmpty()
    @IsString()
    description: string;
    
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    stock!: number;

    @IsOptional()
    @IsBoolean()
    deleted: boolean;

    // datatype is not a number, but Category
    @IsNotEmpty()
    category: Category;
}

