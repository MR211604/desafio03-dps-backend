import { Router } from "express";

const router = Router();

import {
  getResources,
  createResource,
  getResource,
  updateResource,
} from "../controllers/resourcesController";
import { schemaValidator } from "../middlewares/schemaValidator";
import { resourceSchema } from "../schemas/resourceSchema";

router.get("/getResources", getResources);
router.get("/getResource/:id", getResource);
router.post("/createResource", schemaValidator(resourceSchema), createResource);
router.put(
  "/updateResource/:id",
  schemaValidator(resourceSchema),
  updateResource
);
router.delete("/deleteResource/:id", updateResource);
export default router;
