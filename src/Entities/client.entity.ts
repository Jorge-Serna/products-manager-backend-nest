import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Address } from './address.entity';

@Entity('clients')
export class Client {
  
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email!: string;

  @OneToOne( () => Address, { cascade: [ 'insert' ] } )
  @JoinColumn()
  address: Address;

}