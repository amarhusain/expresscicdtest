import { Router } from "express";
import { districtController } from "../controllers/district.controller";

const districtRouter = Router();

districtRouter.post('/create-district', districtController.createDistrict);
// districtRouter.get('/getstate/:id', StateController.getStateById);

export default districtRouter;

// CRUD - create, Read, Update, Delete 