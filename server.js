const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const os = require('os');
require('dotenv').config();

const Reading = require('./models/Reading');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI; // set on EC2 via env

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI missing. Set it in .env or environment.");
  process.exit(1);
}

mongoose.connect(MONGODB_URI).then(() => {
  console.log("✅ Mongo connected");
}).catch(e => {
  console.error("❌ Mongo connect failed:", e.message);
  process.exit(1);
});

// ---------- util endpoints ----------
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));
app.get('/whoami', (_req, res) => res.json({ host: os.hostname(), env: process.env.NODE_ENV || 'dev' }));

// ---------- CRUD ----------
app.post('/api/sensors', async (req, res) => {
  try {
    const { location = 'SeminarA', temperature, humidity, description } = req.body;
    const reading = await Reading.create({
      location,
      temperature: typeof temperature === 'number' ? temperature : Math.floor(18 + Math.random() * 12),
      humidity: typeof humidity === 'number' ? humidity : Math.floor(35 + Math.random() * 40),
      description: description || 'auto'
    });
    res.status(201).json({ message: 'created', reading });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/sensors', async (_req, res) => {
  const docs = await Reading.find().sort({ ts: -1 }).limit(100);
  res.json(docs);
});

app.get('/api/sensors/:id', async (req, res) => {
  try {
    const doc = await Reading.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'not found' });
    res.json(doc);
  } catch {
    res.status(400).json({ message: 'invalid id' });
  }
});

app.put('/api/sensors/:id', async (req, res) => {
  try {
    const updated = await Reading.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'not found' });
    res.json({ message: 'updated', updated });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/sensors/:id', async (req, res) => {
  try {
    const del = await Reading.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: 'not found' });
    res.json({ message: 'deleted' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// latest
app.get('/api/sensors/latest', async (_req, res) => {
  const latest = await Reading.findOne().sort({ ts: -1 });
  if (!latest) return res.status(404).json({ message: 'no readings' });
  res.json({ latestTemperature: latest.temperature, latest });
});

app.listen(PORT, () => console.log(`🚀 API listening on :${PORT} (host=${os.hostname()})`));
