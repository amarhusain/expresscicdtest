import { NextFunction, Request, Response } from "express";
import logger from "../common/logger";
import { appointmentService } from "../services/appointment.service";
import { JwtPayload } from "jsonwebtoken";
import { config } from "../common/config";

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

class AppointmentMiddleware {

    async validateBookAppointmentRequestBodyFields(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.name && req.body.email) {
            next();
        } else {
            logger.error('While calling API "' + req.originalUrl + '" missing required field');
            res.status(400).send({ error: 'missing required field' })
        }
    }

    // async validateSignupRequestBodyFields(req: Request, res: Response, next: NextFunction) {
    //     if (req.body && req.body.email && req.body.username && req.body.password) {
    //         next();
    //     } else {
    //         logger.error('While calling API "' + req.originalUrl + '" missing required field');
    //         res.status(400).send({ error: 'missing required field' })
    //     }
    // }


}

export default new AppointmentMiddleware;