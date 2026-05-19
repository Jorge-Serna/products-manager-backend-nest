import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Address } from './address.entity';
import { Order } from './order.entity';
import { Client } from './client.entity';

@Entity('users')
export class User {
  
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  username!: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  password!: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  salt!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne( () => Client )
  @JoinColumn()
  client: Client;



}