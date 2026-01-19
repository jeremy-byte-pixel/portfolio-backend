import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export default async function sendEmail({ name, email, message }) {
  // Email TO YOU
  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "New Contact Form Message",
    text: `
Name: ${name}
Email: ${email}

Message:
${message}
    `
  });

  // Auto-reply TO USER
  await transporter.sendMail({
    from: `"Jeremy Ogolla" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Thanks for contacting me!",
    text: `
Hi ${name},

Thank you for reaching out! I’ve received your message and will get back to you shortly.

Best regards,
Jeremy
    `
  });
}
