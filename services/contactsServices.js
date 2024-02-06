import { Types } from "mongoose";
import { Contact } from "../models/contactModel.js";
import HttpError from "../helpers/HttpError.js";

export async function listContacts(req) {
  const { _id: owner } = req.user;

  const contacts = await Contact.find(
    { owner },
    "name email phone favorite"
  ).populate("owner", "email subscription");
  return contacts;
}

export async function getContactById(contactId, req) {
  const { _id: owner } = req.user;

  const contact = await Contact.findById(contactId)
    .where("owner")
    .equals(owner);
  return contact;
}

export async function removeContact(contactId, req) {
  const { _id: owner } = req.user;

  const contact = await Contact.findByIdAndDelete(contactId)
    .where("owner")
    .equals(owner);
  return contact;
}

export async function addContact(data, user) {
  const { _id: owner } = user;

  const isExist = await Contact.exists({ email: data.email })
    .where("owner")
    .equals(owner);

  if (isExist) {
    console.log("This contact already exist");
    return null;
  }

  const newContact = await Contact.create({ ...data, owner });

  return newContact;
}

export async function updateContactService(id, body, user) {
  const { _id: owner } = user;

  const contact = await Contact.findByIdAndUpdate(id, body, {
    new: true,
  })
    .where("owner")
    .equals(owner);

  return contact;
}

export async function updateStatusContact(id, body, user) {
  const { _id: owner } = user;

  const contact = await Contact.findByIdAndUpdate(id, body, {
    new: true,
  })
    .where("owner")
    .equals(owner);

  return contact;
}

export async function checkId(id, user) {
  const { _id: owner } = user;

  const isValid = Types.ObjectId.isValid(id);

  if (!isValid) throw HttpError(400, "Invalid ID. Not found...");

  const isExist = await Contact.findById(id)
    .select("_id")
    .where("owner")
    .equals(owner);

  if (!isExist) throw HttpError(400, "Invalid ID. Not found...");
}
