import { Model, Schema, model } from "mongoose";


export interface IAlert {
    pending: {
        isActive: boolean;
        name: string;
    }
}

export interface IAlertDocument extends IAlert, Document { }

export interface IAlertModel extends Model<IAlertDocument> {
    buildAlert(args: IAlert): IAlertDocument;
}

const AlertSchema: Schema<IAlertDocument> = new Schema({
    // _id: { type: String, required: true },
    // name: { type: String, required: true }
});

AlertSchema.statics.buildAlert = (args: IAlert) => {
    return new Alert(args)
}

const Alert = model<IAlertDocument, IAlertModel>('Alert', AlertSchema);


export default Alert;