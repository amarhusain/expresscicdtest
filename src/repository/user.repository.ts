import UserModel, { IUserDocument, IUserModel } from "../models/user.model";

// save to db
export class UserRepository {

    constructor(private userModel: IUserModel) {

    }

    async saveUser(user: IUserDocument) {
        const userModel = await this.userModel.create(user);
        // const userModel = await new this.userModel(user);
        return userModel.save();
    }

    async findOneByEmail(email: string) {
        return await this.userModel.findOne({ email });
    }

    async findOneByUsername(username: string) {
        return await this.userModel.findOne({ username });
    }

}

export const userRepository = new UserRepository(UserModel);