import { config } from "../common/config";
import { BadRequestError } from "../common/errors/bad-request-error";
import { NotAuthorizedError } from "../common/errors/not-authorized-error";
import { RecordNotFoundError } from "../common/errors/record-not-found-error";
import { AuthUserDto, CreateUserDto } from "../dto/user.dto";
import { UserRepository, userRepository } from "../repository/user.repository";
import { AuthService, authService } from "./auth.service";

// Business Logic
export class UserService {

    static JWT_KEY = config.jwtKey;

    constructor(private userRepository: UserRepository, private authService: AuthService) {

    }



    async createUser(user: CreateUserDto) {
        const existingEmail = await this.userRepository.findOneByEmail(user.email);
        if (existingEmail) return new BadRequestError('User already exists!');

        const existingMobile = await this.userRepository.findOneByMobile(user.mobile);
        if (existingMobile) return new BadRequestError('Mobile number is already registered!');

        user.password = await this.authService.pwdToHash(user.password);

        const newUser = await this.userRepository.saveUser(user);
        if (!newUser) return new BadRequestError("Couldn't register the user");

        if (!UserService.JWT_KEY) return new BadRequestError("JWT key not found");
        const token = await this.authService.generateJwt({ email: newUser.email, userId: newUser.id }, UserService.JWT_KEY, config.jwtExpiresIn);

        return { token, id: newUser._id, name: newUser.name, email: newUser.email, mobile: newUser.mobile, role: newUser.role };

    }

    async authenticateUser(authUserDto: AuthUserDto) {
        let userFound = await this.userRepository.findOneByEmail(authUserDto.emailOrUsername);
        if (!userFound) return new RecordNotFoundError(`User ${authUserDto.emailOrUsername} not found`)
        // if (!userFound) {
        //     userFound = await this.userRepository.findOneByUsername(authUserDto.emailOrUsername);
        //     if (!userFound) return new RecordNotFoundError(`User ${authUserDto.emailOrUsername} not found`)
        // }

        const samePwd = await this.authService.pwdCompare(userFound.password, authUserDto.password);
        if (!samePwd) return new NotAuthorizedError(`Email and password are incorrect.`);

        if (!UserService.JWT_KEY) return new BadRequestError("JWT key not found");
        const token = await this.authService.generateJwt({ email: userFound.email, userId: userFound.id }, UserService.JWT_KEY, config.jwtExpiresIn);

        return { token, id: userFound._id, name: userFound.name, email: userFound.email, mobile: userFound.mobile, role: userFound.role };
    }

    async findUserById(userId: string) {
        return await this.userRepository.findById(userId);
    }



}

export const userService = new UserService(userRepository, authService);