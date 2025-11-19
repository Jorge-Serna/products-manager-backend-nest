import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
  
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name:'name',  type:'varchar', length:100, nullable: false })
  catName!: string;

  @OneToMany(() => Product, (product) => product.category)
  product: Product[];

}