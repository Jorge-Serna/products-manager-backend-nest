import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('addresses')
export class Address {
  
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type:'varchar', length:100, nullable: false })
  country!: string;

  @Column({ type:'varchar', length:100, nullable: false })
  town!: string;

  @Column({ type:'varchar', length:100, nullable: false })
  street!: string;

  

}