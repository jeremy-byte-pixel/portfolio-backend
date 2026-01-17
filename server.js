require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const contactRoutes = require("./routes/contact");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/contact", contactRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Portfolio backend is live and connected to the database 🚀");
});

// Listen on the port provided by Render or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
