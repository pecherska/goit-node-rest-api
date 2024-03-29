import express from "express";
import validateBody from "../helpers/validateBody.js";
import { loginSchema, registerSchema } from "../models/user.js";
import {
  wrappedLogin,
  wrappedRegister,
  wrappedGetCurrent,
  wrappedLogout,
  wrappedUpdateAvatar,
} from "../controllers/authControllers.js";
import authenticate from "../helpers/authenticate.js";
import upload from "../helpers/upload.js";

const authRouter = express.Router();
authRouter.post("/register", validateBody(registerSchema), wrappedRegister);
authRouter.post("/login", validateBody(loginSchema), wrappedLogin);
authRouter.get("/current", authenticate, wrappedGetCurrent);
authRouter.post("/logout", authenticate, wrappedLogout);
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  wrappedUpdateAvatar
);

export default authRouter;
