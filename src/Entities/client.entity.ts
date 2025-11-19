import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clients')
export class Client {
  
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name:'name',  type:'varchar', length:255, nullable: false })
  clientName!: string;

//   @Column({ name:'creation_date', type:'date', nullable: false })
//   creationDate!: Date;

//   @Column({ type:'varchar', length:255, nullable: false })
//   description!: string;

//   @Column({ type:'decimal', nullable: false })                              
//   price!: number;

//   @Column({ type:'int', nullable: false })                              
//   stock!: number;

//   @Column({ type:'tinyint', nullable: false, default:false })                              
//   status!: boolean;

//   @Column({ type:'tinyint', nullable: true, default:false })                              
//   deleted?: boolean;
}