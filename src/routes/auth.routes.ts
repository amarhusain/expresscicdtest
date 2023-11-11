import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post('/signup', authMiddleware.validateSignupRequestBodyFields, authController.signup);
authRouter.post('/signin', authMiddleware.validateSigninRequestBodyFields, authController.signin);

export default authRouter;
