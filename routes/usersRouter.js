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
  updateAvatar,
  updateSubscription,
} from "../controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { validateBody } from "../helpers/validateBody.js";

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
userRouter.patch("/avatars", protect, upload, updateAvatar);

export default userRouter;
