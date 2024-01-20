import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.join("db", "contacts.json");

export async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  const data = await listContacts();
  const contact = data.find((option) => option.id === contactId);
  return contact || null;
}

export async function removeContact(contactId) {
  const data = await listContacts();
  const contact = data.findIndex((option) => option.id === contactId);

  if (contact !== -1) {
    const [deletedContact] = data.splice(contact, 1);

    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));

    return deletedContact;
  } else {
    return null;
  }
}

export async function addContact(data) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...data,
  };

  const isExist = contacts.some((element) => element.email === data.email);
  if (isExist) {
    return null;
  }

  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
}

export async function updateContactService(id, body) {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((option) => option.id === id);

  if (contactIndex === -1) {
    return null;
  }

  const updatedContact = {
    ...contacts[contactIndex],
    ...body,
  };

  contacts[contactIndex] = updatedContact;
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return updatedContact;
}
