import { CreateStateDto } from "../dto/state.dto";
import State, { IStateModel } from "../models/state.model";



export class StateRepository {

    constructor(private stateModel: IStateModel) {

    }

    async createState(createStateDto: CreateStateDto) {
        const state = new this.stateModel(createStateDto);
        return state.save();
    }


    async getStateById(id: string) {
        return this.stateModel.findById({ _id: id });
    }


}


export const stateRepository = new StateRepository(State);