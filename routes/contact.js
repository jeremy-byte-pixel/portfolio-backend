const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

// POST contact message
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Save to MongoDB
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    // 3️⃣ Send email to YOU
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "New Portfolio Contact Message",
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    // 4️⃣ Auto-reply to USER
    await sendEmail({
      to: email,
      subject: "Thanks for contacting me!",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out through my portfolio.</p>
        <p>I’ve received your message and will get back to you shortly.</p>
        <br />
        <p>Best regards,<br/>Jerry</p>
      `,
    });

    // 5️⃣ Send success response
    res.status(201).json({ message: "Message sent successfully" });

  } catch (error) {
    console.error("CONTACT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
