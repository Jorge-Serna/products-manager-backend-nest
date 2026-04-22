import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Address } from './address.entity';
import { Order } from './order.entity';

@Entity('clients')
export class Client {
  
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email!: string;

  @OneToOne( () => Address, { cascade: [ 'insert', 'update' ] } )
  @JoinColumn()
  address: Address;

  @OneToMany( () => Order, o => o.client )
  orders: Order[];

}