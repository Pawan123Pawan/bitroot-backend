const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumbers: [{ type: String, unique: true }],
  image: String,
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
