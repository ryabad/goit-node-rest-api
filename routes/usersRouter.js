import { Router } from "express";
import {
  loginUserSchema,
  signupUserSchema,
  updateSubSchema,
} from "../schemas/userSchema.js";
import {
  current,
  logIn,
  logout,
  register,
  updateSubscription,
} from "../controllers/userController.js";

import validateBody from "../helpers/validateBody.js";
import { protect } from "../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.post("/register", validateBody(signupUserSchema), register);
userRouter.post("/login", validateBody(loginUserSchema), logIn);
userRouter.post("/logout", protect, logout);
userRouter.get("/current", protect, current);
userRouter.patch(
  "/subscription",
  validateBody(updateSubSchema),
  protect,
  updateSubscription
);

export default userRouter;
