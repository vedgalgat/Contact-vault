const express = require("express");
const router = express.Router();
const Contact = require("../models/contact.model");
const authenticateUser = require("../middlewares/auth.middleware");

// ADD CONTACT
router.post("/", authenticateUser, async (req, res) => {
  const { name, email, mobile } = req.body;

  const contact = await Contact.create({
    name,
    email,
    mobile,
    userId: req.user._id,
    OwnerOfAccount: req.user.name  // store the creator's name

  });

  res.json(contact);
});

// GET CONTACTS
router.get("/", authenticateUser, async (req, res) => {
  const contacts = await Contact.find({ userId: req.user._id })
  res.json(contacts);
});
// DELETE
router.delete("/:id", authenticateUser, async (req, res) => {
  const contact = await Contact.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  res.json({ message: "Contact deleted" });
});

// UPDATE
router.put("/:id", authenticateUser, async (req, res) => {
  const updated = await Contact.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Contact not found" });
  }

  res.json(updated);
});


module.exports = router;
