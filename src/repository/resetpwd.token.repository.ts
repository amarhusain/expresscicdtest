import { CreateResetPwdTokenDto } from "../dto/user.dto";
import ResetPwdToken, { IResetPwdTokenDocument, IResetPwdTokenModel } from "../models/resetpwd.token.model";

// save to db
export class ResetPwdTokenRepository {

    constructor(private resetPwdTokenModel: IResetPwdTokenModel) {

    }

    async saveResetPwdToken(createResetPwdTokenDto: CreateResetPwdTokenDto) {
        return await new this.resetPwdTokenModel(createResetPwdTokenDto).save();
        // const resetPwdResetPwdTokenModel = new this.resetPwdTokenModel(createResetPwdTokenDto);
        // const resetPwdResetPwdTokenModel = await new this.resetPwdResetPwdTokenModel(resetPwdResetPwdToken);
        // return await resetPwdResetPwdTokenModel.save();
    }

    async findById(resetPwdResetPwdTokenId: string) {
        return await this.resetPwdTokenModel.findById({ _id: resetPwdResetPwdTokenId });
    }

    async findOneByEmail(email: string) {
        return await this.resetPwdTokenModel.findOne({ email });
    }

    async findOneByMobile(mobile: string) {
        return await this.resetPwdTokenModel.findOne({ mobile });
    }

    async savePwdResetResetPwdTokenInDb(updatedResetPwdToken: IResetPwdTokenDocument) {
        return await this.resetPwdTokenModel.findByIdAndUpdate(updatedResetPwdToken._id, updatedResetPwdToken, { new: true });
    }

}

export const resetPwdTokenRepository = new ResetPwdTokenRepository(ResetPwdToken);