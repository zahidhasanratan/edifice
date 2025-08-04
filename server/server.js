const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ========== Middlewares ==========
app.use(cors());
app.use(express.json());

// ========== MongoDB Connection ==========
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ========== Route Imports ==========
const pageRoutes = require("./routes/pageRoutes");
const sliderRoutes = require("./routes/sliderRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const projectRoutes = require("./routes/projectRoutes");
const teamRoutes = require("./routes/teamRoutes");
const newsRoutes = require("./routes/newsRoutes");
const albumRoutes = require("./routes/albumRoutes");
const photoRoutes = require("./routes/photoRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const contactMailRoutes = require("./routes/contactMailRoutes"); // ✅ updated
const menuRoutes = require("./routes/menuRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const contactInfoRoutes = require('./routes/contactInfo.route');
// ========== API Routes ==========
app.use("/api/pages", pageRoutes);
app.use("/api/sliders", sliderRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactMailRoutes); // ✅ correct usage
app.use("/api/menus", menuRoutes);
app.use("/api/visitors", visitorRoutes);
app.use('/api/contactInfo', contactInfoRoutes);

// ========== Root Route ==========
app.get("/", (req, res) => {
  res.send("🚀 API Server is running...");
});

// ========== Error Handler ==========
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// ========== Start Server ==========
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
