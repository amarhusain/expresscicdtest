import { config } from "../common/config";
import { ConflictError } from "../common/errors/conflict-error";
import { NotAuthorizedError } from "../common/errors/not-authorized-error";
import { AuthUserDto, CreateUserDto } from "../dto/user.dto";
import { UserRepository, userRepository } from "../repository/user.repository";
import { AuthService, authService } from "./auth.service";

// Business Logic
export class UserService {

    constructor(private userRepository: UserRepository, private authService: AuthService) {

    }

    async createUser(user: CreateUserDto) {
        const existingMail = await userRepository.findOneByEmail(user.email);
        // Email already exists, return 409 Conflict status code
        if (existingMail) return new ConflictError('Email id already used');

        const existingMobile = await userRepository.findOneByMobile(user.mobile);
        // Mobile already exists, return 409 Conflict status code
        if (existingMobile) return new ConflictError('Mobile number already used');

        user.password = await this.authService.pwdToHash(user.password);

        const newUser = await this.userRepository.saveUser(user);

        const token = await this.authService.generateJwt({ email: newUser.email, userId: newUser.id }, config.jwtKey, config.jwtExpiresIn);

        return { token, id: newUser._id, name: newUser.name, email: newUser.email, mobile: newUser.mobile, role: newUser.role };

    }

    async authenticateUser(authUserDto: AuthUserDto) {
        let userFound = await this.userRepository.findOneByEmail(authUserDto.emailOrUsername);
        if (!userFound) return new NotAuthorizedError(`Invalid credentials`)
        // if (!userFound) {
        //     userFound = await this.userRepository.findOneByUsername(authUserDto.emailOrUsername);
        //     if (!userFound) return new RecordNotFoundError(`User ${authUserDto.emailOrUsername} not found`)
        // }

        const samePwd = await this.authService.pwdCompare(userFound.password, authUserDto.password);
        if (!samePwd) return new NotAuthorizedError(`Invalid credentials`);

        const token = await this.authService.generateJwt({ email: userFound.email, userId: userFound.id }, config.jwtKey, config.jwtExpiresIn);

        return { token, id: userFound._id, name: userFound.name, email: userFound.email, mobile: userFound.mobile, role: userFound.role };
    }

    async findUserById(userId: string) {
        return await this.userRepository.findById(userId);
    }



}

export const userService = new UserService(userRepository, authService);