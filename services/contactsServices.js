import { Types } from "mongoose";
import { Contact } from "../models/contactModel.js";
import HttpError from "../helpers/HttpError.js";

export async function listContacts() {
  const contacts = await Contact.find();
  return contacts;
}

export async function getContactById(contactId) {
  const contact = await Contact.findById(contactId);
  return contact;
}

export async function removeContact(contactId) {
  const contact = await Contact.findByIdAndDelete(contactId);
  return contact;
}

export async function addContact(data) {
  const isExist = await Contact.exists({ email: data.email });

  if (isExist) {
    console.log("This contact already exist");
    return null;
  }

  const newContact = await Contact.create(data);

  return newContact;
}

export async function updateContactService(id, body) {
  const contact = await Contact.findById(id);

  Object.keys(body).forEach((key) => {
    contact[key] = body[key];
  });

  return contact.save();
}

export async function updateStatusContact(id, body) {
  const contact = await Contact.findById(id);

  Object.keys(body).forEach((key) => {
    contact[key] = body[key];
  });

  return contact.save();
}

export async function checkId(id) {
  const isValid = Types.ObjectId.isValid(id);

  if (!isValid) throw HttpError(400, "Invalid ID. User not found...");
}
