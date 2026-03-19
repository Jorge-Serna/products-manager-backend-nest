import { IsDate, IsOptional, IsUUID } from "class-validator";

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

}