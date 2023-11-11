import { Model, Schema, model } from "mongoose";


export interface IState {
    _id: string;
    name: string;
}

export interface IStateDocument extends IState, Document { }

export interface IStateModel extends Model<IStateDocument> {
    buildState(args: IState): IStateDocument;
}

const StateSchema: Schema<IStateDocument> = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true }
});

StateSchema.statics.buildState = (args: IState) => {
    return new State(args)
}

const State = model<IStateDocument, IStateModel>('State', StateSchema);


export default State;