import { Router } from "express";
import { appointmentController } from "../controllers/appointment.controller";
import appointmentMiddleware from "../middleware/appointment.middleware";

const appointmentRouter = Router();

appointmentRouter.post('/book', appointmentMiddleware.validateBookAppointmentRequestBodyFields, appointmentController.bookAppointment);
appointmentRouter.get('/slots', appointmentController.getAppointmentSlot);

export default appointmentRouter;

// CRUD - create, Read, Update, Delete 