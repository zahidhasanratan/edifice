// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===================== CORS (dynamic, env-driven) ===================== */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow server-to-server / SSR / curl (no Origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  optionsSuccessStatus: 204,
};

// CORS first
app.use(cors(corsOptions));

// ✅ Express 5–safe preflight fast-path (avoid app.options("*", ...))
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ✅ Tell caches that responses vary by Origin (CRITICAL for CORS on Vercel/CDNs)
app.use((req, res, next) => {
  const existing = res.getHeader("Vary");
  if (existing) {
    res.setHeader("Vary", String(existing) + ", Origin");
  } else {
    res.setHeader("Vary", "Origin");
  }
  // Prevent stale CORS being reused
  res.setHeader("Cache-Control", "no-store");
  // Helpful for debugging in Network tab
  if (req.headers.origin) res.setHeader("X-Debug-Origin", req.headers.origin);
  next();
});

/* ===================== Body Parsers ===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===================== MongoDB ===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* ===================== Routes ===================== */
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
const contactMailRoutes = require("./routes/contactMailRoutes");
const menuRoutes = require("./routes/menuRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const contactInfoRoutes = require("./routes/contactInfo.route");
const careerRoutes = require("./routes/careerRoutes");
const careerApplicationRoutes = require("./routes/careerApplicationRoutes");

/* ===================== Health Check ===================== */
app.get("/", (req, res) => {
  res.json({
    ok: true,
    msg: "🚀 API Server is running...",
    origin: req.headers.origin || null,
    allowedOrigins,
  });
});

/* ===================== Mount APIs ===================== */
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
app.use("/api/contact", contactMailRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/contactInfo", contactInfoRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/career-applications", careerApplicationRoutes);

/* ===================== Error Handler ===================== */
app.use((err, req, res, next) => {
  if (err && String(err.message || "").startsWith("Not allowed by CORS")) {
    return res.status(403).json({ message: err.message });
  }
  console.error("Unhandled Error:", err?.stack || err);
  res.status(500).json({ message: "Something went wrong!", error: err?.message });
});

/* ===================== Export / Start ===================== */
const port = process.env.PORT || 5000;

// On Vercel, don't app.listen — we export the app and let /api/index.js use it.
if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
}

module.exports = app;
