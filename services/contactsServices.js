import { Contact } from "../models/contactModel.js";

export const listContacts = async req => {
	const { _id: id } = req.params;
	const { _id: owner } = req.user;
	const { page = 1, limit = 10 } = req.query;
	const skip = (page - 1) * limit;
	const readFileContacts = await Contact.findOne({ id, owner })
		.skip(skip)
		.limit(limit)
		.populate("owner", "-_id email subscription");

	return readFileContacts;
};

export const getContactById = async contactId => {
	const readFileContacts = await Contact.findOne({ _id: contactId, owner: _id }).populate(
		"owner",
		"-_id email subscription",
	);
	return readFileContacts;
};

export const addContact = async data => {
	const readFileContacts = await Contact.create(data);
	return readFileContacts;
};

export const removeContact = async contactId => {
	const readFileContacts = await Contact.findByIdAndDelete(contactId);
	return readFileContacts;
};

export const contactUpdate = async (contactId, data) => {
	const readFileContacts = await Contact.findByIdAndUpdate(contactId, data, { new: true });
	return readFileContacts;
};

export const updateContactStatus = async (contactId, data) => {
	const readFileContacts = await Contact.findByIdAndUpdate(contactId, data, { new: true });
	return readFileContacts;
};
