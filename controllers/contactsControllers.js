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
    const { id: owner } = req.user;

    const contacts = await listContacts(owner);

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const { id: owner } = req.user;

    const contact = await getContactById({ contactId, owner });

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
    const { id: owner } = req.user;
    const contactId = req.params.id;

    const contact = await removeContact({ contactId, owner });

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
    const { id: owner } = req.user;

    const data = await addContact({ body: req.body, owner });

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const contactId = req.params.id;

    const contact = await updateContactService({
      contactId,
      body: req.body,
      owner,
    });

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const contactId = req.params.id;

    const contact = await updateStatusContact({
      contactId,
      body: req.body,
      owner,
    });

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const checkContactId = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const contactId = req.params.id;

    await checkId({ owner, contactId });

    next();
  } catch (error) {
    next(error);
  }
};
