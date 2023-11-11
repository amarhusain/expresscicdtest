import mongoose from "mongoose";
import { authService } from "../services/auth.service";

export interface IUserDocument extends mongoose.Document {
    email: string;
    password: string;
    username: string;
}

export interface IUserModel extends mongoose.Model<IUserDocument> { }

const UserSchema: mongoose.Schema<IUserDocument> = new mongoose.Schema(
    {
        email: { type: String, trim: true, required: true, unique: true },
        password: { type: String, required: true },
        username: { type: String, trim: true, required: true, unique: true }
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret._id;
                delete ret.password;
            }
        }
    }
);

UserSchema.pre('save', async function (done) {
    if (this.isModified('password') || this.isNew) {
        const hashedPwd = authService.pwdToHash(this.get('password'));
        this.set('password', hashedPwd);
    }
    done();
})

const UserModel = mongoose.model<IUserDocument>('User', UserSchema);

export default UserModel;