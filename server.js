require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const contactRoutes = require("./routes/contact");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB error:", err));

app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("Backend + Database connected 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
