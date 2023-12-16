import { Router } from "express";
import { appointmentController } from "../controllers/appointment.controller";
import appointmentMiddleware from "../middleware/appointment.middleware";
import authMiddleware from "../middleware/auth.middleware";

const appointmentRouter = Router();

appointmentRouter.post('/book', appointmentMiddleware.validateBookAppointmentRequestBodyFields, appointmentController.bookAppointment);
appointmentRouter.get('/slots', appointmentController.getAppointmentSlot);
appointmentRouter.get('/list', authMiddleware.validateUserAuthentication, authMiddleware.checkUserRoleIsDoctor, appointmentController.getAppointmentList);

export default appointmentRouter;

// CRUD - create, Read, Update, Delete 