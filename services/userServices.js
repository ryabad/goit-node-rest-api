import { User } from "../models/userModel.js";
import { signToken } from "./jwtService.js";
import HttpError from "../helpers/HttpError.js";

export async function signup(userData) {
  const { email } = userData;

  const user = await User.findOne({ email });

  if (user) throw HttpError(409, "User with this email already exists");

  const newUser = await User.create({
    ...userData,
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
