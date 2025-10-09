import { Router } from "express";
import { schemaValidator } from "../middlewares/schemaValidator";
import { loginSchema, registerSchema } from "../schemas/userSchema";
import { loginUser, registerUser } from "../controllers/userController";

const router = Router();

router.post("/register", schemaValidator(registerSchema), registerUser);
router.post("/login", schemaValidator(loginSchema), loginUser);

export default router;
