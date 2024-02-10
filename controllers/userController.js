import { User } from "../models/userModel.js";
import { login, signup, updateUser } from "../services/userServices.js";

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

    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { user } = await updateUser({ id: _id, body: req.body });

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};
