import { Router } from "express";
import { districtController } from "../controllers/district.controller";

const districtRouter = Router();

districtRouter.post('/create', districtController.createDistrict);
districtRouter.get('/', districtController.allDistrict);

export default districtRouter;

// CRUD - create, Read, Update, Delete 