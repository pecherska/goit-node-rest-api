import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      match: emailRegex,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

export const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(4).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(4).required(),
});

export const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

const User = model("user", userSchema);

export default User;
