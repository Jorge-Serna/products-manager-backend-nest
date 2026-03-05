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

        // when updating a client, I can send a client with an updated email address
        // or I can send a client with the same email address
        // case 1: 
        //          clientExists gets an email address if it exists, but if don't, app continues
        // case 2: 
        //          clientExists finds a register
        //          case 2.1:
        //                  it is the same register because email was not changed
        //          case 2.2:
        //                  it is another email. In this case there must be an error because email must be unique
        if( clientExists && clientExists.id != client.id ){
            throw new ConflictException(`There's already a client using this email`)
        }

        
        let addressExists: Address;
        var deleted = false;
        clientExists = await this.getClientById( client.id );

        if( client.address.id ){

            addressExists = await this.addressRepository.findOne({
                where: {
                    id: client.address.id
                }
            })

            /* I got 3 objects here, the one passed as parameter in the function "client", "clientExists", and "addressExists"
                Now, Im gonna validate that this address.id (which is the same in "addressExists" & "client.address.id") is the same as the one stored in DB for this clientById */

            if( addressExists && addressExists.id != clientExists.address.id ) {
                throw new ConflictException('This address already exists and its ID does not make match with the previous one stored');

                // IDs match, but what is it with the rest of the data? lets validate it
            } else if ( JSON.stringify(addressExists) != JSON.stringify(client.address) ) {
                /*  why "addressExists" and "client.address" ??? addressExists and clientExists.address were gotten from db, they are the same, because they have the same ID
                Well, at this point we know that client.address matches the id with the one stored in the DB for this register  so now, it is ovious that id is the same, then if the rest is different, lets validate that the rest does not exist for another client  
                In case addressExists is false or null it comes here as well because it is different from client.address
                */


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
                    deleted = true;
                }

            }

        } else {

            // when we use save(), app creates 2 registers, a client and an address
            // in case it has an address with same data, it should display error because sddresses must be unique
            // otherwise if there is a different address, it should create a new register, so the one left must be deleted

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
                // it is valid here, and addresse will be updated
                // address not associated with any client must be deleted
                deleted = true;
            }

        }

        return this.addressRepository.save( client );

    }
}
