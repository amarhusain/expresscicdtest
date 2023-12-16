import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { config } from "../common/config";
import logger from "../common/logger";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import { USER_TYPE } from "../utils/constants";

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

class AuthMiddleware {

    async validateSigninRequestBodyFields(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.emailOrUsername && req.body.password) {
            next();
        } else {
            logger.error('While calling API "' + req.originalUrl + '" missing required field');
            res.status(400).send({ error: 'missing required field' })
        }
    }

    async validateSignupRequestBodyFields(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.email && req.body.name && req.body.mobile && req.body.password) {
            next();
        } else {
            logger.error('While calling API "' + req.originalUrl + '" missing required field');
            res.status(400).send({ error: 'missing required field' })
        }
    }

    async validateUserAuthentication(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                logger.error('Auth token not found');
                res.status(401).send({ error: 'Auth token not found' });
            } else {
                if (config.jwtKey) {
                    const decoded = await authService.verifyJwt(token, config.jwtKey);
                    // (req as CustomRequest).token = decoded;
                    req.body.payload = decoded;
                    next();

                } else {
                    logger.error('JWT key not found');
                    res.status(401).send({ error: 'JWT key not found' });
                }

            }
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                logger.error(`[${error.name}] : ${error.message}`);
                res.status(401).send({ error: `[${error.name}] : ${error.message}` });
            } else if (error.name === 'JsonWebTokenError') {
                logger.error(`[${error.name}] : ${error.message}`);
                res.status(401).send({ error: `[${error.name}] : ${error.message}` });
            } else {
                logger.error(`[${error.name}] : ${error.message}`);
                res.status(401).send({ error: `[${error.name}] : ${error.message}` });
            }

        }
    }

    async checkUserRoleIsDoctor(req: Request, res: Response, next: NextFunction) {
        const { payload } = req.body;
        if (payload) {
            const result = await userService.findUserById(payload.userId);
            if (result) {
                if (result.role === USER_TYPE.DOCTOR) {
                    next();
                } else {
                    logger.error('Unauthorised access');
                    res.status(401).send({ error: 'Unauthorised access' })
                }
            } else {
                logger.error('Unauthorised access');
                res.status(401).send({ error: 'Unauthorised access' });
            }
        } else {
            logger.error('Unauthorised access');
            res.status(401).send({ error: 'Unauthorised access' });
        }
    }

}

export default new AuthMiddleware;