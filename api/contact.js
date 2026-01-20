import mongoose from "mongoose";
import Contact from "../models/Contact";
import sendEmail from "../utils/sendEmail";

const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB (serverless-friendly)
let isConnected = false;

async function connectToDB() {
  if (isConnected) return;
  await mongoose.connect(MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });
  isConnected = true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connectToDB();

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    // Send thank you email to user
    await sendEmail({
      to: email,
      subject: "Thank you for contacting me",
      text: `Hi ${name},\n\nThank you for reaching out! I will respond shortly.\n\nBest regards,\nJeremy`
    });

    // Optional: send notification email to yourself
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "New contact form submission",
      text: `New message from ${name} (${email}):\n\n${message}`
    });

    res.status(200).json({ message: "Message sent successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
}
