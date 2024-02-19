import { model, Schema } from "mongoose";
import { compare, genSalt, hash } from "bcrypt";

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: String,
  avatarURL: String,
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await genSalt(8);
  this.password = await hash(this.password, salt);

  next();
});

userSchema.methods.checkPassword = (candidate, password) =>
  compare(candidate, password);

export const User = model("User", userSchema);
