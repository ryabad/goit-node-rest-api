import sgMail from "@sendgrid/mail";

import dotenv from "dotenv";

import { User } from "../models/userModel.js";
import { HttpError } from "../helpers/HttpError.js";
import { nanoid } from "nanoid";

dotenv.config({
  path: "./envs/dev.env",
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (data) => {
  const message = { ...data, from: "adolfwolfan323@gmail.com" };

  try {
    await sgMail.send(message);
  } catch (error) {
    console.log("error", error);
  }
};

export const verify = async (data) => {
  const { verificationToken } = data;

  const user = await User.findOne({ verificationToken });

  if (!user) throw HttpError(404, "User not found");

  await User.findByIdAndUpdate(user.id, {
    verify: true,
    verificationToken: null,
  });
};

export const reVerification = async (data) => {
  const { email } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const newVerificationToken = nanoid();

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { verificationToken: newVerificationToken },
    { new: true }
  );

  const verifyMessage = {
    to: email,
    subject: "Re-Verify",
    html: `<a target="_blank" href="${process.env.VERIFY_URL}/${updatedUser.verificationToken}">Re-Verify Account</a>`,
  };

  await sendEmail(verifyMessage);
};
