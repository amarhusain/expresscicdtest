import { NextFunction, Request, Response } from "express";
import { config } from "../common/config";
import { CustomError } from "../common/errors/custom-error";
import { NotAuthorizedError } from "../common/errors/not-authorized-error";
import logger from "../common/logger";
import { appointmentService } from "../services/appointment.service";
import { authService } from "../services/auth.service";


class AppointmentController {

    async bookAppointment(req: Request, res: Response, next: NextFunction) {
        const { name, email, mobile, gender, age, occupation, address, appointmentDate,
            presentComplain, pastMedicalHistory, familySevereDisease, familySevereDiseaseSide,
            familySevereDiseaseMember, familySevereDiseaseDetail, smoking, alcoholic,
            drugAddict, doctorId } = req.body;

        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            console.log('controller book appointment start', JSON.stringify({
                name, email, mobile, gender, age, occupation, address, presentComplain, pastMedicalHistory, familySevereDisease, familySevereDiseaseSide,
                familySevereDiseaseMember, familySevereDiseaseDetail, smoking, alcoholic,
                drugAddict, doctorId
            }));
            if (!token) {
                // Auth token not found 
                // just createuser and book appointment
                let appointmentDt = new Date(appointmentDate);
                const result = await appointmentService.createUserAndBookAppointment({
                    name, email, mobile, gender, age, occupation, address, appointmentDt, presentComplain, pastMedicalHistory, familySevereDisease, familySevereDiseaseSide,
                    familySevereDiseaseMember, familySevereDiseaseDetail, smoking, alcoholic,
                    drugAddict, doctorId
                });
                if (result instanceof CustomError || result instanceof Error) {
                    next(result);
                } else {
                    res.status(200).send(result);
                    logger.info('API url "' + req.originalUrl + '" handled successfully!');
                }
            } else {
                //check user is loggedin and token is valid
                const payload = await authService.verifyJwt(token, config.jwtKey);

                if (payload) {
                    // old user only book
                    const result = await appointmentService.bookAppointment(payload.userId);
                    if (result instanceof CustomError || result instanceof Error) {
                        next(result);
                    } else {
                        res.status(200).send(result);
                        logger.info('API url "' + req.originalUrl + '" handled successfully!');
                    }
                } else {
                    logger.error('Auth token expire need to login');
                    return new NotAuthorizedError('Auth token expire need to login again.');
                }

            }
        } catch (error: any) {
            next(error);
        }



    }

    // async addPatientDetail(req: Request, res: Response, next: NextFunction) {
    //     const { userId, gender, age, occupation,
    //         address, presentComplain, pastMedicalHistory, familySevereDisease,
    //         familySevereDiseaseSide, familySevereDiseaseMember,
    //         familySevereDiseaseDetail, smoking, alcoholic,
    //         drugAddict, payload } = req.body;
    //     try {
    //         const result = await appointmentService.addPatientDetail({
    //             userId, gender, age, occupation,
    //             address, presentComplain, pastMedicalHistory, familySevereDisease,
    //             familySevereDiseaseSide, familySevereDiseaseMember,
    //             familySevereDiseaseDetail, smoking, alcoholic,
    //             drugAddict
    //         }, payload);
    //         if (result instanceof CustomError || result instanceof Error) {
    //             next(result);
    //         } else {

    //             res.status(200).send(result);
    //             logger.info('API url "' + req.originalUrl + '" handled successfully!');
    //         }
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    async getAppointmentSlot(req: Request, res: Response, next: NextFunction) {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        try {

            const result = await appointmentService.getAppointmentSlot(token);
            if (result instanceof CustomError || result instanceof Error) {
                next(result);
            } else {
                res.status(200).send(result);
                logger.info('API url "' + req.originalUrl + '" handled successfully!');
            }
        } catch (error) {
            next(error);
        }
    }

    async getAppointmentList(req: Request, res: Response, next: NextFunction) {
        const { payload } = req.body;
        try {
            const result = await appointmentService.getAppointmentByDoctorId(payload.userId);
            if (result instanceof CustomError || result instanceof Error) {
                next(result);
            } else {
                res.status(200).send(result);
                logger.info('API url "' + req.originalUrl + '" handled successfully!');
            }
        } catch (error) {
            next(error);
        }
    }

}

export const appointmentController = new AppointmentController();
