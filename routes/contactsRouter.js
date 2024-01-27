import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatus,
  checkUserId,
} from "../controllers/contactsControllers.js";

import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.use("/:id", checkUserId);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), updateContact);

contactsRouter.patch(
  "/:id/favorite",
  validateBody(updateStatusSchema),
  updateStatus
);

export default contactsRouter;
