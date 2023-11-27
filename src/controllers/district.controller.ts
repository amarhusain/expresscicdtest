import { NextFunction, Request, Response } from "express";
import { DistrictService, districtService } from "../services/district.service";
import { CustomError } from "../common/errors/custom-error";
import logger from "../common/logger";


class DistrictController {


    async createDistrict(req: Request, res: Response, next: NextFunction) {
        const { _id, name, stateId } = req.body;
        const result = await districtService.createDistrict({ _id, name, stateId });
        if (result instanceof CustomError || result instanceof Error) {
            next(result);
        } else {
            res.status(200).send(result);
            logger.info('API url "' + req.originalUrl + '" handled successfully!')
        }
    }

    async allDistrict(req: Request, res: Response, next: NextFunction) {
        const result = await districtService.getAllDistrict();
        if (result instanceof CustomError || result instanceof Error) {
            next(result);
        } else {
            res.status(200).send(result);
            logger.info('API url "' + req.originalUrl + '" handled successfully!')
        }
    }

}

export const districtController = new DistrictController();