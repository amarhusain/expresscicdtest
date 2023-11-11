import { CreateStateDto } from "../dto/state.dto";
import { StateRepository, stateRepository } from "../repository/state.repository";

export class StateService {

    constructor(private stateRepository: StateRepository) {

    }

    async createState(createStateDto: CreateStateDto) {
        return await stateRepository.createState(createStateDto);
    }

    async getStateById(id: string) {
        return await stateRepository.getStateById(id);
    }

}

export const stateService = new StateService(stateRepository);