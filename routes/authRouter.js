import express from "express";
import validateBody from "../helpers/validateBody.js";
import { loginSchema, registerSchema } from "../models/user.js";
import {
  wrappedLogin,
  wrappedRegister,
  wrappedGetCurrent,
  wrappedLogout,
} from "../controllers/authControllers.js";
import authenticate from "../helpers/authenticate.js";

const authRouter = express.Router();
authRouter.post("/register", validateBody(registerSchema), wrappedRegister);
authRouter.post("/login", validateBody(loginSchema), wrappedLogin);
authRouter.get("/current", authenticate, wrappedGetCurrent);
authRouter.post("/logout", authenticate, wrappedLogout);

export default authRouter;
