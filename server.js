//import express library
const express = require("express");
//import mongoose library
const mongoose = require("mongoose");
const Contact = require("./contactSchema");
const app = express();

app.use(express.static("public"));

//permet d'obtenir json par des requetes
app.use(express.json());

const PORT = 3000;

mongoose
  .connect("mongodb://localhost/Contacts")
  .then(() => console.log("Connecté à la BD Mongo..."))
  .catch((error) => console.log("Echec de connexion à la BD Mongo...", error));

app.get("/api/contact", (req, res) => {
  console.log(req.body);
  Contact.find()
    .then((contacts) => {
      res.status(200).json(contacts);
    })
    .catch((error) => {
      res.status(400).json({ message: "Error while fetching contacts" });
    });
});

app.post("/api/contact", (req, res) => {
  console.log(req.body);
  const contact = new Contact(req.body);
  contact
    .save()
    .then(() => {
      res.status(200).json({ message: "Login saved successfully" });
    })
    .catch((error) => {
      res.status(400).json({ message: "Error while saving todo" });
    });
});

app.get("/api/contact/:id", (req, res) => {
  const contactId = req.params.id;
  // Ici, tu dois utiliser contactId pour récupérer les détails du contact correspondant depuis la base de données
  Contact.findById(contactId)
    .then((contact) => {
      if (!contact) {
        res.status(404).json({ message: "Contact not found" });
      } else {
        res.status(200).json(contact);
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal server error" });
    });
});

app.delete("/api/contact/:id", (req, res) => {
  const { id } = req.params;
  Contact.findByIdAndDelete(id)
    .then(() => {
      res.status(200).json({ message: "Contact deleted successfully" });
    })
    .catch((error) => {
      res.status(400).json({ message: "Error while deleting contact" });
    });
});

app.put("/api/contact/:id", (req, res) => {
  console.log("testing");

  const { id } = req.params;
  const { nom, prenom, entreprise, telephone, mobile, email, adresse } =
    req.body;

  const updatedFields = {};
  if (nom !== undefined && nom !== "") updatedFields.nom = nom;
  if (prenom !== undefined && prenom !== "") updatedFields.prenom = prenom;
  if (entreprise !== undefined) updatedFields.entreprise = entreprise;
  if (entreprise === "") updatedFields.entreprise = "undefined";
  if (telephone !== undefined) updatedFields.telephone = telephone;
  if (telephone === "") updatedFields.telephone = "(000)-000-0000";
  if (mobile !== undefined) updatedFields.mobile = mobile;
  if (mobile === "") updatedFields.mobile = "(000)-000-0000";
  if (email !== undefined) updatedFields.email = email;
  if (email === "") updatedFields.email = "________@gmail.com";
  if (adresse !== undefined) updatedFields.adresse = adresse;
  if (adresse === "") updatedFields.adresse = "adresse undefined";

  Contact.findByIdAndUpdate(id, updatedFields, { new: true })
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ message: "Contact not found." });
      }
      res.json({ message: "Contact successfully updated.", contact });
    })
    .catch((err) => {
      console.error("Contact could not be updated :", err);
      res.status(500).json({ message: "Contact could not be updated" });
    });
});

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
