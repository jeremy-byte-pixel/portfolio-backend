import mongoose from "mongoose";
import Contact from "../models/Contact.js";
import { sendEmail } from "../utils/sendEmail.js";

mongoose.set("strictQuery", true);

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = await Contact.create({ name, email, message });

    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `New contact from ${name}`,
      text: `Message from ${name} (${email}): ${message}`
    });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
