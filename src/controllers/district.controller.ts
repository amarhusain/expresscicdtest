import { NextFunction, Request, Response } from "express";
import { DistrictService, districtService } from "../services/district.service";


export class DistrictController {

    // districtService = districtService;
    // mobile = 7464646

    constructor(private districtService: DistrictService, private mobile: number) {

    }

    async createDistrict(req: Request, res: Response, next: NextFunction) {
        const { _id, name, stateId } = req.body;
        await districtService.createDistrict({ _id, name, stateId });
    }

}

export const districtController = new DistrictController(districtService, 7464646);