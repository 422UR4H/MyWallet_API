import { Router } from "express";
import { signin, signout, signup } from "../controllers/auth.controller.js";
import { userSchema } from "../schemas/user.schemas.js";
import { loginSchema } from "../schemas/login.schemas.js";
import validateBody from "../middlewares/validateBody.js";
import validateAuth from "../middlewares/validateAuth.js";

const router = Router();

router.post("/sign-up", validateBody(userSchema), signup);
router.post("/sign-in", validateBody(loginSchema), signin);

router.use(validateAuth);

router.post("/sign-out", signout);

export default router;