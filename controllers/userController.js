import HttpError from "../helpers/HttpError.js";
import { User } from "../models/userModel.js";
import { login, signup } from "../services/userServices.js";

export const register = async (req, res, next) => {
  try {
    const { user } = await signup(req.body);

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logIn = async (req, res, next) => {
  try {
    const { user, token } = await login(req.body);

    res.status(200).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    console.log("id", _id);
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const check = Object.keys(req.body);

    if (!(check.length === 1 && check.includes("subscription"))) {
      throw HttpError(404, "Not Found. Must contain only subscription field");
    }

    const { _id } = req.user;

    const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });

    res.status(200).json({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};
