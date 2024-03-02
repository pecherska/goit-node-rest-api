import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/crtlWrapper.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import jimp from "jimp";
import { nanoid } from "nanoid";
import sendMail from "../helpers/sendEmail.js";

dotenv.config();
const { SECRET_KEY, BASE_URL } = process.env;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, subscription, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a tagret="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
  };

  await sendMail(verifyEmail);

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a tagret="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
  };

  await sendMail(verifyEmail);
  res.json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, subscription, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  const image = await jimp.read(tempUpload);
  await image.resize(250, 250);
  await image.writeAsync(tempUpload);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

export const wrappedRegister = ctrlWrapper(register);
export const wrappedLogin = ctrlWrapper(login);
export const wrappedGetCurrent = ctrlWrapper(getCurrent);
export const wrappedLogout = ctrlWrapper(logout);
export const wrappedUpdateAvatar = ctrlWrapper(updateAvatar);
export const wrappedVerifyEmail = ctrlWrapper(verifyEmail);
export const wrappedResendVerifyEmail = ctrlWrapper(resendVerifyEmail);
