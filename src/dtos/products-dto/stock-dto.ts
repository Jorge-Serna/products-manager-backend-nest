import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from "class-validator";

export class StockDto {

    // Para que funcionen los decoradores - validadores me instalé npm i class-validators

    // Este DTO no va a una tabla stock, sino que trabaja sobre Products

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    id: number;

    @IsNotEmpty()
    @Min(0)
    @Max(1000)
    @IsNumber()
    stock: number


}