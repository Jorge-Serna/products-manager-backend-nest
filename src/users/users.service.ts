import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository( User )
        private usersRepository: Repository<User>
    ){}

    async getUserByEmail( email ){

        return await this.usersRepository.findOne({
            where: {
                email
            }
        })

    }
}
