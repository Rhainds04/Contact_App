const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  entreprise: { type: String, default: "" },
  telephone: { type: String, default: "(514)-000-0000" },
  mobile: { type: String, default: "(514)-000-0000" },
  email: { type: String, default: "email@gmail.com" },
  adresse: { type: String, default: "" },
});

module.exports = mongoose.model("Contact", contactSchema);
