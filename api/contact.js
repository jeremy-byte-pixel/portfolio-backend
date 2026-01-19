import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Contact from "../models/contact.js";

// MongoDB connection cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save message to database
    await Contact.create({ name, email, message });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to you
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: `Email: ${email}\n\nMessage:\n${message}`,
    });

    // Auto-reply
    await transporter.sendMail({
      from: `"Jeremy Ogolla" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for contacting me!",
      text: "Thank you for reaching out. I’ll get back to you shortly.",
    });

    return res.status(200).json({ message: "Message sent successfully" });

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
