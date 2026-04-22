import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientsService } from 'src/clients/clients.service';
import { OrderDto } from 'src/dtos/orders/order-dto';
import { Order } from 'src/entities/order.entity';
import { ProductsService } from 'src/products/products.service';
import { IsNull, Not, Repository } from 'typeorm';
import { UpdateResult } from 'typeorm/browser';

@Injectable()
export class OrdersService {

    constructor(
        private productsService: ProductsService,
        private clientsService: ClientsService,
        
        @InjectRepository(Order)
        private readonly ordersRepository: Repository<Order>
    ){}


    async createOrder( order: OrderDto ){

        const clientExists = await this.clientsService.getClientById( order.client.id );

        if(!clientExists){
            throw new ConflictException('client does not exist');
        }

        for( let p of order.products ){

            const productExists = await this.productsService.findProduct( p.id );

            if( !productExists ){
                throw new ConflictException('product does not exist');
            }

            if( productExists.deleted ){
                throw new ConflictException('this product should not be deleted')
            }
        }

        return await this.ordersRepository.save( order );

    }

    async getOrderById( id: string ){

        return await this.ordersRepository.findOne({
            where: {
                id: id
            }
        })

    }

    async getPendingOrders(){

        return await this.ordersRepository.find({
            where: {
                confirmAt: IsNull()
            }
        })
    }

    async getConfirmedOrders( start: Date, end: Date ){

        const startDate = new Date( start );
        const endDate = new Date( end );

        if( !isNaN( startDate.getDate() ) || !isNaN( endDate.getDate() )){

            const query = this.ordersRepository.createQueryBuilder('orders')
            .leftJoin('orders.products', 'products')
            .leftJoin('orders.client', 'client')
            .select([
                'orders',
                'products',
                'client'
            ])

            if( !isNaN( startDate.getDate() ) ){
                query.andWhere("orders.confirmAt >= :st", { st: startDate })
            }

            if( !isNaN( endDate.getDate() ) ){
                query.andWhere("orders.confirmAt <= :e", { e: endDate })
            }

            return await query.getMany();

        } else {
            throw new NotFoundException('Date params were not recognized');
        }
    }

    async confirmOrder( id ){

        const orderExists = await this.getOrderById( id );

        if( !orderExists ){
            throw new NotFoundException(`Order with ID: ${id} couldn't be found`);
        }

        if( orderExists.confirmAt ){
            throw new ConflictException(`Order with ID: ${id} was already confirmed`);
        }

        const rows: UpdateResult = await this.ordersRepository.update( { id }, { confirmAt: new Date() });

        return rows.affected === 1;

    }

    async getOrdersByClient( id ){

        const query = this.ordersRepository.createQueryBuilder('orders')
        .leftJoinAndSelect('orders.client', 'client')
        .leftJoinAndSelect('orders.products', 'products')
        .where( 'client.id = :clientID', { clientID: id } )

        return await query.getMany();

    }
    
}
