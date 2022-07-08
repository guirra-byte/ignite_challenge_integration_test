import { inject, injectable } from "tsyringe";
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../../../../config/auth';

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IAuthenticateUserResponseDTO } from "./IAuthenticateUserResponseDTO";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

interface IRequest {
  email: string;
  password: string;
}

interface IRequireJWTPayload {

  user: {
    name: string,
    email: string,
    id?: string
  },
  token: string
}

const requireJWTPass: string = "f750766d2e4617e94eb4f943625ceeaa"

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  async execute({ email, password }: IRequest): Promise<IAuthenticateUserResponseDTO> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new IncorrectEmailOrPasswordError();
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new IncorrectEmailOrPasswordError();
    }

    const token = sign({}, requireJWTPass, {
      subject: user.id,
      expiresIn: "1d",
    });

    const requireJWTResponse: IRequireJWTPayload = {

      user: {

        name: user.name,
        email: user.email,
        id: user.id
      },
      token: token
    }

    console.log(requireJWTResponse);

    return requireJWTResponse;
  }
}
