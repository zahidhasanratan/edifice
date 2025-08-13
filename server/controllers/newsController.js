const News = require("../models/News");

// Small helper to prevent caching on list/detail GETs
const setNoStore = (res) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });
};

// @desc Create a news article
// @route POST /api/news
exports.createNews = async (req, res) => {
  try {
    const {
      title,
      publishDate,
      shortDetails,
      featuredPhoto,
      coverPhoto,
      description,
    } = req.body;

    if (
      !title ||
      !publishDate ||
      !shortDetails ||
      !featuredPhoto ||
      !coverPhoto ||
      !description
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newNews = new News({
      title,
      publishDate,
      shortDetails,
      featuredPhoto,
      coverPhoto,
      description,
    });

    const savedNews = await newNews.save();
    return res.status(201).json(savedNews);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc Get all news with search & pagination
// @route GET /api/news
exports.getAllNews = async (req, res) => {
  try {
    setNoStore(res);

    const pageRaw = parseInt(req.query.page, 10);
    const limitRaw = parseInt(req.query.limit, 10);
    const search = (req.query.search || "").trim();

    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 && limitRaw <= 50
        ? limitRaw
        : 5;

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { shortDetails: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await News.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // If current page exceeds totalPages (e.g., after deletions),
    // clamp to last page.
    const safePage = Math.min(page, totalPages);

    const news = await News.find(query)
      .sort({ publishDate: -1, _id: -1 }) // deterministic sort
      .skip((safePage - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({
      total,
      page: safePage,
      limit,
      totalPages,
      news,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc Get single news article
// @route GET /api/news/:id
exports.getNewsById = async (req, res) => {
  try {
    setNoStore(res);

    const news = await News.findById(req.params.id).lean();
    if (!news) return res.status(404).json({ message: "News not found" });
    return res.json(news);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc Update news article
// @route PUT /api/news/:id
exports.updateNews = async (req, res) => {
  try {
    const {
      title,
      publishDate,
      shortDetails,
      featuredPhoto,
      coverPhoto,
      description,
    } = req.body;

    const updated = await News.findByIdAndUpdate(
      req.params.id,
      {
        title,
        publishDate,
        shortDetails,
        featuredPhoto,
        coverPhoto,
        description,
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return res.status(404).json({ message: "News not found" });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc Delete news article
// @route DELETE /api/news/:id
exports.deleteNews = async (req, res) => {
  try {
    // Use deleteOne so we can return deletedCount reliably
    const result = await News.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "News not found", deletedCount: 0 });
    }

    return res.json({
      message: "News deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
