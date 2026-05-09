import { Router } from "express";

const router = Router();

import {
  getResources,
  createResource,
  getResource,
  updateResource,
  deleteResource,
  addFavoriteResource,
  removeFavoriteResource,
  getFavoritesResourcesByUser,
  rateResource,
} from "../controllers/resourcesController";
import { schemaValidator } from "../middlewares/schemaValidator";
import { resourceSchema } from "../schemas/resourceSchema";
import { authenticate, authorize } from "../middlewares/authMiddleware";

// Public routes
router.get("/getResources", getResources);
router.get("/getResource/:id", getResource);
router.get("/getFavoritesResourcesByUser/:userId", getFavoritesResourcesByUser);

// Authenticated user routes
router.post("/addFavoriteResource", authenticate, addFavoriteResource);
router.delete("/removeFavoriteResource", authenticate, removeFavoriteResource);
router.post("/rateResource", authenticate, rateResource);

// Admin routes
router.post(
  "/createResource",
  authenticate,
  authorize("admin"),
  schemaValidator(resourceSchema),
  createResource,
);
router.put(
  "/updateResource/:id",
  authenticate,
  authorize("admin"),
  schemaValidator(resourceSchema),
  updateResource,
);
router.delete(
  "/deleteResource/:id",
  authenticate,
  authorize("admin"),
  deleteResource,
);

export default router;
