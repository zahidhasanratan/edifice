const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parses application/json

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/sliders", require("./routes/sliderRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/projects", require("./routes/projectRoutes")); // For Option 1 (JSON API)

// Optional base route
app.get("/", (req, res) => {
  res.send("API Server is running");
});

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
