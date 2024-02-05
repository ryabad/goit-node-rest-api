import HttpError from "../helpers/HttpError.js";
import {
  addContact,
  checkId,
  getContactById,
  listContacts,
  removeContact,
  updateContactService,
  updateStatusContact,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const id = req.params.id;

    const contact = await getContactById(id);

    if (!contact) {
      throw HttpError(404);
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const id = req.params.id;

    const contact = await removeContact(id);

    if (!contact) {
      throw HttpError(404);
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const data = await addContact(req.body);

    if (!data) {
      throw HttpError(409, "This email already used");
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }

    if (Object.keys(req.body).includes("favorite")) {
      throw HttpError(400, "favorite field should not be in the body");
    }

    const id = req.params.id;

    const contact = await updateContactService(id, req.body);

    if (!contact) {
      throw HttpError(404);
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const check = Object.keys(req.body);

    if (!(check.length === 1 && check.includes("favorite"))) {
      throw HttpError(404, "Not Found. Must contain only favorite field");
    }

    const id = req.params.id;
    const contact = await updateStatusContact(id, req.body);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const checkContactId = async (req, res, next) => {
  try {
    await checkId(req.params.id);
    next();
  } catch (error) {
    next(error);
  }
};
