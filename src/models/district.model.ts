import { Model, Schema, model } from "mongoose";


export interface IDistrict {
    _id: string;
    name: string;
    stateId: string;
}

export interface IDistrictDocument extends IDistrict, Document { }

export interface IDistrictModel extends Model<IDistrictDocument> {
    buildState(args: IDistrict): IDistrictDocument;
}

const DistrictSchema: Schema<IDistrictDocument> = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    stateId: { type: String, required: true }
});

DistrictSchema.statics.buildDistrict = (args: IDistrict) => {
    return new District(args)
}

const District = model<IDistrictDocument, IDistrictModel>('District', DistrictSchema);


export default District;