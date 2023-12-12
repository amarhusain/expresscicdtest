import { CreateUserDto } from "../dto/user.dto";
import UserModel, { IUserDocument, IUserModel } from "../models/user.model";

// save to db
export class UserRepository {

    constructor(private userModel: IUserModel) {

    }

    async saveUser(user: CreateUserDto) {
        const userModel = new this.userModel(user);
        // const userModel = await new this.userModel(user);
        return await userModel.save();
    }

    async findById(userId: string) {
        return await this.userModel.findById({ _id: userId });
    }

    async findOneByEmail(email: string) {
        return await this.userModel.findOne({ email });
    }

    async findOneByMobile(mobile: string) {
        return await this.userModel.findOne({ mobile });
    }

    // async findOneByUsername(name: string) {
    //     return await this.userModel.findOne({ name });
    // }

}

export const userRepository = new UserRepository(UserModel);