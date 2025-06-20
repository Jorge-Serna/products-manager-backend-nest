import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type:'varchar', length:255, nullable:true })
  name: string;

  @Column({ name:'creation_date', type:'date', nullable:true })
  creationDate: Date;

  @Column({ type:'varchar', length:255, nullable:true })
  description: string;

  @Column({ type:'decimal', nullable:true })
  price: number;
}
