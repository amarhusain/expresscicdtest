import { BadRequestError } from "../common/errors/bad-request-error";
import { NotAuthorizedError } from "../common/errors/not-authorized-error";
import { RecordNotFoundError } from "../common/errors/record-not-found-error";
import { AuthUserDto } from "../dto/user.dto";
import { IUserDocument } from "../models/user.model";
import { UserRepository, userRepository } from "../repository/user.repository";
import { AuthService, authService } from "./auth.service";

// Business Logic
export class UserService {

    static JWT_KEY = process.env.key;

    constructor(private userRepository: UserRepository, private authService: AuthService) {

    }

    async createUser(user: IUserDocument) {
        const existingEmail = await this.userRepository.findOneByEmail(user.email);
        if (existingEmail) return new BadRequestError('User already exists!');

        const usernameTaken = await this.userRepository.findOneByUsername(user.username);
        if (usernameTaken) return new BadRequestError('Username is already taken!');

        user.password = await this.authService.pwdToHash(user.password);

        const newUser = await this.userRepository.saveUser(user);
        if (!newUser) return new BadRequestError("Couldn't register the user");

        if (!UserService.JWT_KEY) return new BadRequestError("JWT key not found");
        const token = await this.authService.generateJwt({ email: newUser.email, userId: newUser.id }, UserService.JWT_KEY);

        return { token, email: newUser.email, username: newUser.username };
    }

    async authenticateUser(authUserDto: AuthUserDto) {
        let userFound = await this.userRepository.findOneByEmail(authUserDto.emailOrUsername);
        if (!userFound) {
            userFound = await this.userRepository.findOneByUsername(authUserDto.emailOrUsername);
            if (!userFound) return new RecordNotFoundError(`User ${authUserDto.emailOrUsername} not found`)
        }

        const samePwd = await this.authService.pwdCompare(userFound.password, authUserDto.password);
        if (!samePwd) return new NotAuthorizedError(`Email and password are incorrect.`);

        if (!UserService.JWT_KEY) return new BadRequestError("JWT key not found");
        const token = await this.authService.generateJwt({ email: userFound.email, userId: userFound.id }, UserService.JWT_KEY);

        return { token, email: userFound.email, username: userFound.username };
    }

}

export const userService = new UserService(userRepository, authService);