import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name:'name',  type:'varchar', length:255, nullable:true })
  productName: string;

  @Column({ name:'creation_date', type:'date', nullable:true })
  creationDate: Date;

  @Column({ type:'varchar', length:255, nullable:true })
  description: string;

  @Column({ type:'decimal', nullable:true })                              
  price: number;

  // @Column({ type:'tinyint', nullable:false, default:false })                              
  // status: number;

  // @Column({ type:'int', nullable:true })                              
  // stock: number;
}
