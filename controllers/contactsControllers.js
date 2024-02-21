import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/crtlWrapper.js";
import Contact from "../models/contact.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name email");
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;

  const result = await Contact.findOne({ _id: id });

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({
    message: "Delete success",
  });
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

export const wrappedGetAllContacts = ctrlWrapper(getAllContacts);
export const wrappedGetOneContact = ctrlWrapper(getOneContact);
export const wrappedDeleteContact = ctrlWrapper(deleteContact);
export const wrappedCreateContact = ctrlWrapper(createContact);
export const wrappedUpdateContact = ctrlWrapper(updateContact);
export const wrappedUpdateFavorite = ctrlWrapper(updateStatusContact);
