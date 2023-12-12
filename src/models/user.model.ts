import mongoose from "mongoose";
import { authService } from "../services/auth.service";

export interface IUserDocument extends mongoose.Document {
    name: string;
    email: string;
    mobile: string;
    password: string;
    isPasswordChanged: boolean;
    role: string;
}

export interface IUserModel extends mongoose.Model<IUserDocument> { }

const UserSchema: mongoose.Schema<IUserDocument> = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, trim: true, required: true, unique: true },
        mobile: { type: String, unique: true },
        password: { type: String, required: true },
        isPasswordChanged: { type: Boolean, required: true },
        role: { type: String, required: true },
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

const User = mongoose.model<IUserDocument>('User', UserSchema);

export default User;