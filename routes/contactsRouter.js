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
import authenticate from "../helpers/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, wrappedGetAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, wrappedGetOneContact);

contactsRouter.delete("/:id", authenticate, isValidId, wrappedDeleteContact);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  wrappedCreateContact
);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(updateContactSchema),
  wrappedUpdateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(updateContactSchema),
  wrappedUpdateFavorite
);

export default contactsRouter;
