import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { ClientDto } from "../clients-dtos/client-dto";
import { ProductDto } from "../products-dtos/product-dto";

export class OrderDto {

    @IsOptional()
    @IsUUID()
    id?: string;

    @IsOptional()
    @IsDate()
    createdAt?: Date;

    @IsOptional()
    @IsDate()
    updatedAt?: Date;

    @IsOptional()
    @IsDate()
    confirmAt?: Date;

    @IsNotEmpty()
    client: ClientDto

    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    products: ProductDto[];

}