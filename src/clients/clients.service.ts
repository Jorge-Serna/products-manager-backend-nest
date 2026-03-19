import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientDto } from 'src/dtos/clients-dtos/client-dto';
import { Address } from 'src/entities/address.entity';
import { Client } from 'src/entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {

    constructor(
        @InjectRepository( Client )
        private clientRepository: Repository<Client>,
        @InjectRepository( Address )
        private addressRepository: Repository<Address>
    ){}

    findClient( client: ClientDto ){
        
        return this.clientRepository.findOne({
            where: [
                { id : client.id },
                { email : client.email }
            ]
        })
    }

    async createClient( client: ClientDto ){

        var c = await this.findClient( client );

        if( c ){
            if( client.id === c.id ) {
                throw new ConflictException(`There's already a client using id ${client.id}`);
            } else {
                throw new ConflictException(`There's already a client using email address ${client.email}`);
            }
        }

        var addressExists: Address;

        if( client.address.id ){
            addressExists = await this.addressRepository.findOne({
                where: {
                    id: client.address.id
                }
            })
        } else {
            addressExists = await this.addressRepository.findOne({
                where: {
                    country: client.address.country,
                    town: client.address.town,
                    street: client.address.street
                }
            })
        }

        if( addressExists ){
            throw new ConflictException('This address already exists')
        }

        return this.clientRepository.save( client );

    }

    async getAllClients(){

        var clients = await this.clientRepository.find({
            relations: {
                address: true
            }
        });

        return clients;

    }

    async getClientById( id: number){
        
        var client = await this.clientRepository.findOne({
            where: {
                id: id
            },
            relations: {
                address: true
            }
        })

        if(!client){
            throw new NotFoundException(`Client with id ${id} wasn't found`);
        }

        return client;
    }

    async updateClient( client: ClientDto ){

        // if this is the case, function ends here
        if(!client.id){
            return this.createClient( client );
        }

        let clientExists = await this.clientRepository.findOne({
            where: {
                email: client.email
            }
        })

        // when updating a client, this function can receive a client with an updated email address
        // or an existing one
        // case 1: 
        //          clientExists does not find anything. That means that it is a brand new email address

        // case 2: clientExists finds a register
        //          case 2.1:
        //                  it is the very same client, because email hasn't changed
        //          case 2.2:
        //                  it is another email. In this case another client has the same one, and there must be an error because email must be unique
        if( clientExists && clientExists.id != client.id ){
            throw new ConflictException(`There's already a client using this email`)
        }

        var deleteAddress = false;
        clientExists = await this.getClientById( client.id );
        let addressExists: Address;

        if( client.address.id ){

            addressExists = await this.addressRepository.findOne({
                where: {
                    id: client.address.id
                }
            })

            /* I got 3 objects here, the one passed as parameter in the function "client", "clientExists" (which is gotten from db with client.id), and "addressExists" ( which is gotten from db with client.address.id) Now, Im gonna validate that this addresses ("addressExists" || "client.address.id") is the same as the one gotten by clienExists */

            // compare IDS
            if( addressExists && client.address.id != clientExists.address.id ) {
                throw new ConflictException('This address already exists and its ID does not make match with the previous one stored');

            // compare content
            } else if ( JSON.stringify( addressExists ) != JSON.stringify( client.address ) ) {

                addressExists = await this.addressRepository.findOne({
                    where: {
                        country: client.address.country,
                        town: client.address.town,
                        street: client.address.street
                    }
                })



                if( addressExists ){
                    throw new ConflictException('This address already exists')
                } else {
                    // in case it has an ID but it is a new one with new content delete the previous one
                    deleteAddress = true;
                }

            } // if id remains the same and content too, it just skips these 2 conditions

        } else {

            // when we use save(), app creates 2 registers, a client and an address
            // in case it has an address with same data, it should display error because sddresses must be unique
            // otherwise if there is a different address, it should create a new register, and the one left must be deleted

            addressExists = await this.addressRepository.findOne({
                where: {
                    country: client.address.country,
                    town: client.address.town,
                    street: client.address.street
                }
            })

            if( addressExists ){
                throw new ConflictException('This address already exists')
            } else {
                // address without ID is not associated with any client, it must be deleted
                deleteAddress = true;
            }

        }

        const newClient = await this.clientRepository.save( client );

        if( deleteAddress && newClient ){
            await this.addressRepository.delete( { id : clientExists.address.id } );
        }

        return newClient;

    }

    async deleteClient( id ){

        const clientExists = await this.getClientById( id );

        if( !clientExists ) {
            throw new ConflictException('this client does not exist');
        }

        const row = await this.clientRepository.delete({ id })

        if( row.affected == 1 ){
            // delete address now
            await this.addressRepository.delete({ id: clientExists.address.id });
            return true;
        }

        return false;
    }
}
