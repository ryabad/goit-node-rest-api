import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import Jimp from "jimp";

import { signToken } from "./jwtService.js";
import { User } from "../models/userModel.js";

import { HttpError } from "../helpers/HttpError.js";

const avatarsPath = path.resolve("public", "avatars");

export async function signup(userData) {
  const { email } = userData;

  const user = await User.findOne({ email });

  if (user) throw HttpError(409, "User with this email already exists");

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...userData,
    avatarURL,
  });

  return { user: newUser };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });

  if (!user) throw HttpError(401, "Email or password is wrong");

  const isPasswordValid = await user.checkPassword(password, user.password);

  if (!isPasswordValid) throw HttpError(401, "Email or password is wrong");

  const token = signToken(user._id);

  await User.findByIdAndUpdate(user._id, { token });

  return { user, token };
}

export async function checkUserExist(data) {
  const userExists = await User.exists(data);

  if (userExists) throw HttpError(409, "User already exists...");
}

export async function updateUser(data) {
  const { id, body } = data;

  const check = Object.keys(body);

  if (!(check.length === 1 && check.includes("subscription"))) {
    throw HttpError(404, "Not found! Must contain only subscription field");
  }

  const updatedUser = await User.findByIdAndUpdate(id, body, {
    new: true,
  });

  return { user: updatedUser };
}

export async function updateUserAvatar(data) {
  const { id, file } = data;

  if (!file) {
    throw HttpError(400, "File is missing");
  }

  const { path: tmpUpload, originalname } = file;
  const fileName = `${id}_${nanoid()}_${originalname}`;
  const upload = path.resolve(avatarsPath, fileName);

  const img = await Jimp.read(tmpUpload);
  img.resize(250, 250).write(tmpUpload);
  await fs.rename(tmpUpload, upload);

  const avatarURL = path.join("avatars", fileName);

  const updatedUserAvatar = await User.findByIdAndUpdate(
    id,
    { avatarURL },
    {
      new: true,
    }
  );

  return { avatarURL: updatedUserAvatar.avatarURL };
}
