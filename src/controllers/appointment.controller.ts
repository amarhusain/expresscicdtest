import { NextFunction, Request, Response } from "express";
import { config } from "../common/config";
import { CustomError } from "../common/errors/custom-error";
import logger from "../common/logger";
import { appointmentService } from "../services/appointment.service";
import { authService } from "../services/auth.service";


class AppointmentController {

    async bookAppointment(req: Request, res: Response, next: NextFunction) {
        const { name, email, mobile, gender, age, occupation, address, appointmentDate,
            presentComplain, pastMedicalHistory, familySevereDisease, familySevereDiseaseSide,
            familySevereDiseaseMember, familySevereDiseaseDetail, smoking, alcoholic,
            drugAddict } = req.body;

        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                // Auth token not found 
                // just createuser and book appointment
                let appointmentDt = new Date(appointmentDate);
                const result = await appointmentService.createUserAndBookAppointment({
                    name, email, mobile, gender, age, occupation, address, appointmentDt, presentComplain, pastMedicalHistory, familySevereDisease, familySevereDiseaseSide,
                    familySevereDiseaseMember, familySevereDiseaseDetail, smoking, alcoholic,
                    drugAddict
                });
                if (result instanceof CustomError || result instanceof Error) {
                    next(result);
                } else {
                    res.status(200).send(result);
                    logger.info('API url "' + req.originalUrl + '" handled successfully!');
                }
            } else {

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
                    res.status(401).send({ error: 'Auth token expire need to login' })
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
        try {
            const result = await appointmentService.getAppointmentSlot()
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
