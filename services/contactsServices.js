import { Types } from "mongoose";
import { Contact } from "../models/contactModel.js";
import { HttpError } from "../helpers/HttpError.js";

export async function listContacts(owner) {
  const contacts = await Contact.find(
    { owner },
    "name email phone favorite"
  ).populate("owner", "email subscription");
  return contacts;
}

export async function getContactById(data) {
  const { contactId, owner } = data;

  const contact = await Contact.findById(contactId)
    .where("owner")
    .equals(owner);
  return contact;
}

export async function removeContact(data) {
  const { contactId, owner } = data;

  const contact = await Contact.findByIdAndDelete(contactId)
    .where("owner")
    .equals(owner);
  return contact;
}

export async function addContact(data) {
  const { body, owner } = data;

  const isExist = await Contact.exists({ email: body.email })
    .where("owner")
    .equals(owner);

  if (isExist) {
    console.log("This contact already exist");
    throw HttpError(409, "This email already used");
  }

  const newContact = await Contact.create({ ...body, owner });

  return newContact;
}

export async function updateContactService(data) {
  const { contactId, body, owner } = data;

  if (Object.keys(body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }

  if (Object.keys(body).includes("favorite")) {
    throw HttpError(400, "favorite field should not be in the body");
  }

  const contact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  })
    .where("owner")
    .equals(owner);

  if (!contact) {
    throw HttpError(404);
  }
  return contact;
}

export async function updateStatusContact(data) {
  const { contactId, body, owner } = data;

  const check = Object.keys(body);

  if (!(check.length === 1 && check.includes("favorite"))) {
    throw HttpError(404, "Not Found. Must contain only favorite field");
  }

  const contact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  })
    .where("owner")
    .equals(owner);

  if (!contact) {
    throw HttpError(404);
  }

  return contact;
}

export async function checkId(data) {
  const { owner, contactId } = data;

  const isValid = Types.ObjectId.isValid(contactId);

  if (!isValid) throw HttpError(400, "Invalid ID. Not found...");

  const isExist = await Contact.findById(contactId)
    .select("_id")
    .where("owner")
    .equals(owner);

  if (!isExist) throw HttpError(400, "Invalid ID. Not found...");
}
