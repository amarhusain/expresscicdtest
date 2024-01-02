import mongoose, { Schema } from "mongoose";
import User from "./user.model";


export interface IResetPwdTokenDocument extends mongoose.Document {
    userId: Schema.Types.ObjectId;
    resetPwdToken: string; //resetPwdResetPwdToken
}

export interface IResetPwdTokenModel extends mongoose.Model<IResetPwdTokenDocument> { }

const ResetPwdTokenSchema: mongoose.Schema<IResetPwdTokenDocument> = new mongoose.Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: User, required: true },
        resetPwdToken: { type: String, required: true }
    }
);

const ResetPwdToken = mongoose.model<IResetPwdTokenDocument>('ResetPwdToken', ResetPwdTokenSchema);

export default ResetPwdToken;