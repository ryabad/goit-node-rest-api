import multer from "multer";
import path from "path";
import { HttpError } from "../helpers/HttpError.js";

const tmpDir = path.resolve("tmp");

const multerConfig = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cbk) => {
    cbk(null, file.originalname);
  },
});

const imageFilter = (req, file, cbk) => {
  if (file.mimetype.startsWith("image/")) {
    cbk(null, true);
  } else {
    cbk(HttpError(400, "Only image allow!"), false);
  }
};

export const upload = multer({
  storage: multerConfig,
  fileFilter: imageFilter,
}).single("avatar");
