import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientDto } from 'src/dtos/clients-dtos/client-dto';

@Controller('clients')
export class ClientsController {

    constructor(private clientsService: ClientsService){}

    @Post()
    createClient( @Body() client: ClientDto){
        return this.clientsService.createClient( client);
    }

    @Get()
    getAllClients(){
        return this.clientsService.getAllClients();
    }

    @Get('/:id')
    getClientById(@Param('id') id: number){
        return this.clientsService.getClientById( id );
    }

    @Put()
    updateClient( @Body() client: ClientDto){
        return this.clientsService.updateClient( client );
    }

    @Delete('/:id')
    deleteClient(@Param('id') id: number){
        return this.clientsService.deleteClient( id );
    }
}
