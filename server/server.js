const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ========== Middlewares ==========
app.use(cors());
app.use(express.json()); // To parse JSON requests

// ========== MongoDB Connection ==========
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ========== Routes ==========
app.use("/api/sliders", require("./routes/sliderRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/team", require("./routes/teamRoutes"));
app.use("/api/news", require("./routes/newsRoutes")); 
app.use('/api/albums', require('./routes/albumRoutes'));
app.use("/api/photos", require("./routes/photoRoutes"));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/about', require('./routes/aboutRoutes'));

// ========== Optional Base Route ==========
app.get("/", (req, res) => {
  res.send("🚀 API Server is running...");
});

// ========== Error Handler (Optional Good Practice) ==========
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// ========== Start Server ==========
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
