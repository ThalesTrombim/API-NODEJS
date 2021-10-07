import { getCustomRepository } from 'typeorm';
import { UsersRepositories } from '../repositories/UsersRepositories';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface IAuthenticateRequest {
    email: string;
    password: string;
}

class AuthenticateUserService {

    async execute({email, password} : IAuthenticateRequest) {
        const usersRepositories = getCustomRepository(UsersRepositories);

        const user = await usersRepositories.findOne({
            email
        });

        if(!user){
            throw new Error("Email/Password incorrect")
        }

        const  passswordMatch = await compare(password, user.password);

        if(!passswordMatch){
            throw new Error("Email/Password incorrect")
        }

        const token = sign(
            {
                email: user.email
            }, 
            "28b253f4d611dce072bee7807b65af68", 
            {   
                subject : user.id,
                expiresIn : "1d"
            } 
        );

        return token;
    }
}

export { AuthenticateUserService };