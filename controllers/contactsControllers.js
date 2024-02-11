// import * as contactsService from "../services/contactsServices.js";
import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/crtlWrapper.js";

const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts();
  res.json(result);
};

// const getOneContact = async (req, res) => {
//   const { id } = req.params;
//   const result = await contactsService.getContactById(id);

//   if (!result) {
//     throw HttpError(404, "Not found");
//   }
//   res.json(result);
// };

// const deleteContact = async (req, res) => {
//   const { id } = req.params;
//   const result = await contactsService.removeContact(id);
//   if (!result) {
//     throw HttpError(404, "Not found");
//   }

//   res.json({
//     message: "Delete success",
//   });
// };

// const createContact = async (req, res) => {
//   const result = await contactsService.addContact(req.body);
//   res.status(201).json(result);
// };

// const updateContact = async (req, res) => {
//   const { id } = req.params;
//   const result = await contactsService.updateContact(id, req.body);
//   if (!result) {
//     throw HttpError(404, "Not found");
//   }
//   res.json(result);
// };

export const wrappedGetAllContacts = ctrlWrapper(getAllContacts);
// export const wrappedGetOneContact = ctrlWrapper(getOneContact);
// export const wrappedDeleteContact = ctrlWrapper(deleteContact);
// export const wrappedCreateContact = ctrlWrapper(createContact);
// export const wrappedUpdateContact = ctrlWrapper(updateContact);
