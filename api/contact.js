require("dotenv").config();
const mongoose = require("mongoose");
const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB connection error:", err));

module.exports = async (req, res) => {
  if (req.method === "POST") {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const contact = new Contact({ name, email, message });
      await contact.save();

      // Send thank-you email
      await sendEmail(email, "Thank you for contacting me", "I will get back to you shortly!");

      res.status(200).json({ success: true, message: "Message sent!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
