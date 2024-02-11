import express from "express";
import {
  wrappedGetAllContacts,
  wrappedGetOneContact,
  wrappedDeleteContact,
  wrappedCreateContact,
  wrappedUpdateContact,
  wrappedUpdateFavorite,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema } from "../models/contact.js";
import isValidId from "../helpers/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", wrappedGetAllContacts);

contactsRouter.get("/:id", isValidId, wrappedGetOneContact);

contactsRouter.delete("/:id", isValidId, wrappedDeleteContact);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  wrappedCreateContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(updateContactSchema),
  wrappedUpdateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateContactSchema),
  wrappedUpdateFavorite
);

export default contactsRouter;
