import fs from "fs/promises";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import { nanoid } from "nanoid";

const __dirname = dirname(fileURLToPath(import.meta.url));

const contactsPath = join(__dirname, "../db", "contacts.json");

async function listContacts() {
  const contacts = await fs.readFile(contactsPath);
  console.log(contacts);
  return JSON.parse(contacts);
}
listContacts();

async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId) || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}

async function addContact(data) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...data,
  };

  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function updateContact(id, data) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], ...data };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

export {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
