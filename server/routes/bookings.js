import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db.js";
import { requireAuth, wrap } from "../middleware/auth.js";

const router = Router();
const toId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const mins = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const FLOW = { Pending: ["Confirmed", "Cancelled"], Confirmed: ["Completed", "Cancelled"] };

// Challenge 2: two slots overlap when start < existingEnd AND end > existingStart.
// Only "Confirmed" bookings block a slot.
const findConflict = async ({ studioId, date, startTime, endTime, exclude }) =>
  (await getDb()).collection("bookings").findOne({
    studioId, date, status: "Confirmed",
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
    ...(exclude ? { _id: { $ne: exclude } } : {}),
  });

const conflictMessage = (c, date) =>
  `This studio is already booked from ${c.startTime} to ${c.endTime} on ${date}. Please choose a different slot.`;

router.get("/availability/:studioId", wrap(async (req, res) => {
  const { date } = req.query;
  const slots = await (await getDb()).collection("bookings")
    .find({ studioId: req.params.studioId, date, status: "Confirmed" })
    .project({ startTime: 1, endTime: 1 }).sort({ startTime: 1 }).toArray();
  res.json(slots);
}));

router.get("/mine", requireAuth, wrap(async (req, res) => {
  res.json(await (await getDb()).collection("bookings").find({ userEmail: req.user.email }).sort({ createdAt: -1 }).toArray());
}));

router.get("/incoming", requireAuth, wrap(async (req, res) => {
  res.json(await (await getDb()).collection("bookings").find({ hostEmail: req.user.email }).sort({ createdAt: -1 }).toArray());
}));

router.post("/", requireAuth, wrap(async (req, res) => {
  const { studioId, date, startTime, endTime } = req.body;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "") || !TIME.test(startTime || "") || !TIME.test(endTime || "")) {
    return res.status(400).json({ message: "Choose a valid date, start time and end time." });
  }
  if (mins(endTime) <= mins(startTime)) return res.status(400).json({ message: "End time must be after the start time." });
  if (date < new Date().toISOString().slice(0, 10)) return res.status(400).json({ message: "You cannot book a date in the past." });

  const _id = toId(studioId);
  const db = await getDb();
  const studio = _id && (await db.collection("studios").findOne({ _id }));
  if (!studio) return res.status(404).json({ message: "Studio not found." });
  if (studio.ownerEmail === req.user.email) return res.status(400).json({ message: "You cannot book your own studio." });

  const conflict = await findConflict({ studioId, date, startTime, endTime });
  if (conflict) return res.status(409).json({ message: conflictMessage(conflict, date) });

  const hours = (mins(endTime) - mins(startTime)) / 60;
  const doc = {
    studioId,
    studioTitle: studio.title,
    studioImage: studio.imageUrl,
    studioLocation: studio.location,
    hostEmail: studio.ownerEmail,
    userEmail: req.user.email,
    userName: req.user.name,
    date, startTime, endTime, hours,
    hourlyRate: studio.hourlyRate,
    securityDeposit: studio.securityDeposit,
    total: +(hours * studio.hourlyRate).toFixed(2),
    status: "Pending",
    createdAt: new Date(),
  };
  const result = await db.collection("bookings").insertOne(doc);
  res.status(201).json({ _id: result.insertedId, ...doc });
}));

// Guest cancels their own pending booking
router.patch("/:id/cancel", requireAuth, wrap(async (req, res) => {
  const _id = toId(req.params.id);
  const db = await getDb();
  const booking = _id && (await db.collection("bookings").findOne({ _id }));
  if (!booking) return res.status(404).json({ message: "Booking not found." });
  if (booking.userEmail !== req.user.email) return res.status(403).json({ message: "This is not your booking." });
  if (booking.status !== "Pending") return res.status(400).json({ message: "Only pending bookings can be cancelled." });
  await db.collection("bookings").updateOne({ _id }, { $set: { status: "Cancelled" } });
  res.json({ message: "Booking cancelled." });
}));

// Host confirms / completes / declines a booking for their studio
router.patch("/:id/status", requireAuth, wrap(async (req, res) => {
  const _id = toId(req.params.id);
  const { status } = req.body;
  const db = await getDb();
  const booking = _id && (await db.collection("bookings").findOne({ _id }));
  if (!booking) return res.status(404).json({ message: "Booking not found." });
  if (booking.hostEmail !== req.user.email) return res.status(403).json({ message: "Only the studio host can change this booking." });
  if (!FLOW[booking.status]?.includes(status)) {
    return res.status(400).json({ message: `A ${booking.status.toLowerCase()} booking cannot become ${String(status).toLowerCase()}.` });
  }
  if (status === "Confirmed") {
    const conflict = await findConflict({ ...booking, exclude: booking._id });
    if (conflict) return res.status(409).json({ message: conflictMessage(conflict, booking.date) });
  }
  await db.collection("bookings").updateOne({ _id }, { $set: { status } });
  res.json({ message: `Booking ${status.toLowerCase()}.` });
}));

export default router;
