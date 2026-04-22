import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Client } from "./client.entity";
import { Product } from "./product.entity";

@Entity('orders')
export class Order {

    @PrimaryGeneratedColumn('uuid')
    id?:string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: Date,  nullable: true })
    confirmAt: Date;

    @ManyToOne(() => Client, c => c.orders, { eager: true } )
    client: Client;

    @ManyToMany(() => Product, { eager: true } )
    @JoinTable( {name: 'orders_products'} )
    products: Product[];

}