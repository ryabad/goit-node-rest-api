import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import contactsRouter from "./routes/contactsRouter.js";
import userRouter from "./routes/usersRouter.js";

dotenv.config({
  path: "./envs/dev.env",
});

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connection successful"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.use(express.static("public"));
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
