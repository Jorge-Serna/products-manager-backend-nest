import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Category } from "src/entities/category.entity";

export class CategoryDto {

    // Para que funcionen los decoradores - validadores me instalé npm i class-validators

    // TODO borrar todos los registros de la base de datos actual
    // TODO hacer un insert o que se yo para modificar la tabla "products" le faltan campos
    // checar formulario de angular
    // TODO agregar al dto y al entity nuevos campos

    @IsOptional()
    @IsNumber()
    @IsPositive()
    id: number;

    @IsNotEmpty()
    @IsString()
    catName: string


}