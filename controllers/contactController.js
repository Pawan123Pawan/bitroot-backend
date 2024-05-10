const Contact = require("../models/contactModel");
const fs = require("fs");
const multer = require("multer");
const json2csv = require("json2csv").parse;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//create a new Contact
const contactController = async (req, res) => {
  try {
    const { name, phoneNumbers } = req.body;
    let image;

    // Check if contact with the same phone number already exists
    const existingContact = await Contact.findOne({
      phoneNumbers: { $in: phoneNumbers },
    });
    if (existingContact) {
      return res
        .status(400)
        .json({ message: "Contact with the same phone number already exists" });
    }

    // If image is included in the request, handle image upload
    if (req.file) {
      image = req.file.path; 
    }

    const newContact = new Contact({ name, phoneNumbers, image });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (err) {
    console.error("Error creating new contact:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//delete a contact
const contactDeleteById = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    return res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error("Error deleting contact:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//fetch all contacts
const getAllContactList = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//search contacts
const searchContact = async (req, res) => {
  try {
    const { q } = req.query;
    const contacts = await Contact.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { phoneNumbers: { $regex: q, $options: "i" } },
      ],
    });
    res.json(contacts);
  } catch (err) {
    console.error("Error searching contacts:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//update contact
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phoneNumbers } = req.body;
    let image;
    // If image is included in the request, handle image upload
    if (req.file) {
      image = req.file.path;
    }
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, phoneNumbers, image },
      { new: true }
    );
    res.json(updatedContact);
  } catch (err) {
    console.error("Error updating contact:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// contacts export
const contactExports = async (req, res) => {
  try {
    const contacts = await Contact.find();
    const csv = json2csv(contacts, { fields: ["name", "phoneNumbers"] });
    res.set("Content-Type", "text/csv");
    res.attachment("contacts.csv");
    res.send(csv);
  } catch (err) {
    console.error("Error exporting contacts to CSV:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




module.exports = {
  upload,
  contactController,
  contactDeleteById,
  getAllContactList,
  searchContact,
  updateContact,
  contactExports,
};
