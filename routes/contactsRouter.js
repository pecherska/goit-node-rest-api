import express from "express";
import {
  wrappedGetAllContacts,
  // wrappedGetOneContact,
  // wrappedDeleteContact,
  // wrappedCreateContact,
  // wrappedUpdateContact,
} from "../controllers/contactsControllers.js";
// import validateBody from "../helpers/validateBody.js";
// import {
//   createContactSchema,
//   updateContactSchema,
// } from "../schemas/contactsSchemas.js";
const contactsRouter = express.Router();

contactsRouter.get("/", wrappedGetAllContacts);

// contactsRouter.get("/:id", wrappedGetOneContact);

// contactsRouter.delete("/:id", wrappedDeleteContact);

// contactsRouter.post(
//   "/",
//   validateBody(createContactSchema),
//   wrappedCreateContact
// );

// contactsRouter.put(
//   "/:id",
//   validateBody(updateContactSchema),
//   wrappedUpdateContact
// );

export default contactsRouter;
