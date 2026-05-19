import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService
    ){}

    login( payload ){

        const user = this.usersService.getUserByEmail( payload.email );

        if(!user){
            throw new NotFoundException(`User with email o username ${payload.email} was not found`);
        }

    }

    createPass( rawPassword ){

        const salt = this.getSalt();
        const encoded = this.encodePassword( rawPassword, salt );
        return encoded;

    }

    encodePassword( raw, salt, algorithm = 'sha512', iterations = 5000 ){

        if( !crypto.getHashes().includes( algorithm )){
            throw new Error(`Algorithm ${algorithm} is not supported`);
        }

        const salted = `${raw}{${salt}}`;

        var result: any = '';

        for( let i = 1; i <= iterations; i++) {
            result = crypto.createHash( algorithm ).update(result + salted).digest();
        }

        return Buffer.from(result).toString('base64');

    }

    getSalt(){
        return crypto.createHash('md5').update(`${new Date().toDateString()}${crypto.randomBytes(16).toString('hex')}`).digest('hex');
    }


}
