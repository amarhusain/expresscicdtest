import { NextFunction, Request, Response } from "express";
import { stateService } from "../services/state.service";


export class StateController {

    async createState(req: Request, res: Response, next: NextFunction) {

        const { _id, name } = req.body;

        const result = await stateService.createState({ _id, name });

        return res.status(200).send(result);
    }

    async getStateById(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const result = await stateService.getStateById(id);

        return res.status(200).send(result);

    }

}

export const stateController = new StateController();