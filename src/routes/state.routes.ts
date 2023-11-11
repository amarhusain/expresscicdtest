import { Router } from "express";
import { stateController } from "../controllers/state.controller";
import authMiddleware from "../middleware/auth.middleware";

const stateRouter = Router();

stateRouter.post('/create-state', authMiddleware.validateUserAuthentication, stateController.createState);
stateRouter.get('/getstate/:id', stateController.getStateById);

export default stateRouter;

// CRUD - create, Read, Update, Delete 