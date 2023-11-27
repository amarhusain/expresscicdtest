import { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service";
import { CustomError } from "../common/errors/custom-error";
import logger from "../common/logger";


class AuthController {

    async signup(req: Request, res: Response, next: NextFunction) {
        const result = await userService.createUser(req.body);
        if (result instanceof CustomError || result instanceof Error) {
            next(result);
        } else {
            res.status(200).send(result);
            logger.info('API url "' + req.originalUrl + '" handled successfully!');
        }
    }

    async signin(req: Request, res: Response, next: NextFunction) {
        const result = await userService.authenticateUser(req.body);
        if (result instanceof CustomError || result instanceof Error) {
            next(result);
        } else {

            res.status(200).send(result);
            logger.info('API url "' + req.originalUrl + '" handled successfully!');
        }
    }

}

export const authController = new AuthController();
