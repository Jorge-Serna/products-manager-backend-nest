import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('products')
export class Product {
  
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name:'name',  type:'varchar', length:255, nullable: false })
  productName!: string;

  @Column({ name:'creation_date', type:'date', nullable: false })
  creationDate!: Date;

  @Column({ type:'varchar', length:255, nullable: false })
  description!: string;

  @Column({ type:'decimal', nullable: false })                              
  price!: number;

  @Column({ type:'int', nullable: false })                              
  stock!: number;

  @Column({ type:'tinyint', nullable: false, default:false })                              
  status!: boolean;

  @Column({ type:'tinyint', nullable: true, default:false })                              
  deleted?: boolean;

  @ManyToOne(() => Category, (cat) => cat.product, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name:"category_id" })
  category!: Category;
}
