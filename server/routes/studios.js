import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db.js";
import { requireAuth, wrap } from "../middleware/auth.js";

const router = Router();
const toId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);
const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SORTS = {
  newest: { createdAt: -1 },
  rating: { rating: -1, createdAt: -1 },
  priceAsc: { hourlyRate: 1 },
  priceDesc: { hourlyRate: -1 },
};

const clean = (b) => ({
  title: b.title?.trim(),
  category: b.category,
  hourlyRate: Number(b.hourlyRate),
  securityDeposit: Number(b.securityDeposit || 0),
  capacity: Number(b.capacity),
  location: b.location?.trim(),
  imageUrl: b.imageUrl?.trim() || "",
  gallery: Array.isArray(b.gallery) ? b.gallery.filter(Boolean) : [],
  amenities: Array.isArray(b.amenities) ? b.amenities : [],
  overview: b.overview?.trim(),
});

const problem = (s) => {
  if (!s.title || !s.category || !s.location || !s.overview) return "Title, category, location and overview are required.";
  if (!(s.hourlyRate > 0)) return "Hourly rate must be greater than 0.";
  if (!(s.capacity > 0)) return "Max capacity must be greater than 0.";
  return null;
};

async function ownedStudio(req, res) {
  const _id = toId(req.params.id);
  if (!_id) { res.status(400).json({ message: "Invalid studio id." }); return null; }
  const studio = await (await getDb()).collection("studios").findOne({ _id });
  if (!studio) { res.status(404).json({ message: "Studio not found." }); return null; }
  if (studio.ownerEmail !== req.user.email) {
    res.status(403).json({ message: "You can only change your own listings." });
    return null;
  }
  return studio;
}

// Public list: search, category filter, sort and optional limit (home page uses limit=6)
router.get("/", wrap(async (req, res) => {
  const { search = "", category = "", sort = "newest", limit = 0 } = req.query;
  const q = {};
  if (category) q.category = category;
  if (search) {
    const rx = { $regex: escapeRx(String(search)), $options: "i" };
    q.$or = [{ title: rx }, { location: rx }];
  }
  let cursor = (await getDb()).collection("studios").find(q).sort(SORTS[sort] || SORTS.newest);
  if (Number(limit) > 0) cursor = cursor.limit(Number(limit));
  res.json(await cursor.toArray());
}));

router.get("/mine", requireAuth, wrap(async (req, res) => {
  const list = await (await getDb()).collection("studios")
    .find({ ownerEmail: req.user.email }).sort({ createdAt: -1 }).toArray();
  res.json(list);
}));

router.get("/:id", wrap(async (req, res) => {
  const _id = toId(req.params.id);
  if (!_id) return res.status(400).json({ message: "Invalid studio id." });
  const studio = await (await getDb()).collection("studios").findOne({ _id });
  if (!studio) return res.status(404).json({ message: "Studio not found." });
  res.json(studio);
}));

router.post("/", requireAuth, wrap(async (req, res) => {
  const data = clean(req.body);
  const err = problem(data);
  if (err) return res.status(400).json({ message: err });
  const doc = {
    ...data,
    ownerEmail: req.user.email,
    ownerName: req.user.name,
    rating: 0,
    reviews: [],
    createdAt: new Date(),
  };
  const result = await (await getDb()).collection("studios").insertOne(doc);
  res.status(201).json({ _id: result.insertedId, ...doc });
}));

router.patch("/:id", requireAuth, wrap(async (req, res) => {
  const studio = await ownedStudio(req, res);
  if (!studio) return;
  const data = clean(req.body);
  const err = problem(data);
  if (err) return res.status(400).json({ message: err });
  await (await getDb()).collection("studios").updateOne({ _id: studio._id }, { $set: { ...data, updatedAt: new Date() } });
  res.json({ message: "Studio updated." });
}));

router.delete("/:id", requireAuth, wrap(async (req, res) => {
  const studio = await ownedStudio(req, res);
  if (!studio) return;
  await (await getDb()).collection("studios").deleteOne({ _id: studio._id });
  res.json({ message: "Studio deleted." });
}));

router.post("/:id/reviews", requireAuth, wrap(async (req, res) => {
  const _id = toId(req.params.id);
  if (!_id) return res.status(400).json({ message: "Invalid studio id." });
  const db = await getDb();
  const studio = await db.collection("studios").findOne({ _id });
  if (!studio) return res.status(404).json({ message: "Studio not found." });
  if (studio.ownerEmail === req.user.email) return res.status(400).json({ message: "You cannot review your own studio." });
  const rating = Number(req.body.rating);
  const comment = req.body.comment?.trim();
  if (!(rating >= 1 && rating <= 5) || !comment) return res.status(400).json({ message: "Add a rating from 1 to 5 and a short comment." });
  if ((studio.reviews || []).some((r) => r.email === req.user.email)) {
    return res.status(409).json({ message: "You have already reviewed this studio." });
  }
  const reviews = [...(studio.reviews || []), { name: req.user.name, email: req.user.email, rating, comment, createdAt: new Date() }];
  const avg = +(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
  await db.collection("studios").updateOne({ _id }, { $set: { reviews, rating: avg } });
  res.status(201).json({ message: "Review added.", rating: avg });
}));

export default router;
