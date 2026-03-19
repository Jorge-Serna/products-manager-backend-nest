import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

}