import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from 'src/dtos/orders/order-dto';

@Controller('orders')
export class OrdersController {

    constructor( private ordersService: OrdersService ){}

    @Post()
    createOrder( @Body() order: OrderDto ){
        return this.ordersService.createOrder( order );
    }

    @Get('pending')
    getPendingOrders(){
        return this.ordersService.getPendingOrders();
    }

    @Get('confirmed')
    getConfirmedOrders( @Query('start') start: Date, @Query('end') end: Date ){
        return this.ordersService.getConfirmedOrders(start, end);
    }

    @Get('client/:id')
    getOrdersByClient( @Param('id') id: number ){
        return this.ordersService.getOrdersByClient( id );
    }

    @Get('/:id')
    getOrderByID(@Param('id') id: string ){
        return this.ordersService.getOrderById( id );
    }

    @Patch('/confirm/:id')
    confirmOrder(@Param('id') id: string){
        return this.ordersService.confirmOrder( id );
    }

}
