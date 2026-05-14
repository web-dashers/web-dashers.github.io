const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

let fetchFn;
if (typeof globalThis.fetch === 'function') {
  fetchFn = globalThis.fetch;
} else {
  try { fetchFn = require('node-fetch'); } catch(e) {} 
}
const fetch = fetchFn;

const app = express();

app.use(cors({ origin: "*", methods: ["GET","POST","OPTIONS"], allowedHeaders: ["*"] }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB setup
const MONGO_URI = process.env.MONGODB_URI;
let db;
async function getDB() {
  if (db) return db;
  const client = new MongoClient(MONGO_URI, { tls: true, tlsAllowInvalidCertificates: false, serverSelectionTimeoutMS: 5000 });
  await client.connect();
  db = client.db('webdashers');
  console.log('Connected to MongoDB');
  return db;
}
async function getUsers() {
  const d = await getDB();
  return d.collection('users');
}

function randomID() {
  return Math.floor(Math.random() * (2000000 - 1000000 + 1)) + 1000000;
}

// REGISTER
app.post('/registerGJAccount.php', async (req, res) => {
  try {
    const username = (req.body.username || req.body.userName || '').trim();
    const password = req.body.password || '';
    const email = req.body.email || '';
    if (!username || !password) return res.send('-1');
    const users = await getUsers();
    const existing = await users.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i') } });
    if (existing) return res.send('-1');
    const hashed = await bcrypt.hash(password, 10);
    let id;
    do {
      id = randomID();
    } while (await users.findOne({ id }));
    await users.insertOne({ id, username, password: hashed, email, saveData: {}, createdAt: Date.now() });
    res.send(String(id));
  } catch(e) {
    console.error('Register error:', e.message);
    res.send('-1');
  }
});

// LOGIN
app.post('/loginGJAccount.php', async (req, res) => {
  try {
    const username = (req.body.username || req.body.userName || '').trim();
    const password = req.body.password || '';
    if (!username || !password) return res.send('-1');
    const users = await getUsers();
    const user = await users.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i') } });
    if (!user) return res.send('-1');
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send('-1');
    res.send(`${user.id},${user.id}`);
  } catch(e) {
    console.error('Login error:', e.message);
    res.send('-1');
  }
});

// SAVE DATA
app.post('/saveData.php', async (req, res) => {
  try {
    const username = (req.body.username || '').trim();
    const data = req.body.data || '';
    if (!username || !data) return res.send('-1');
    const users = await getUsers();
    const parsed = JSON.parse(data);
    await users.updateOne(
      { username: { $regex: new RegExp('^' + username + '$', 'i') } },
      { $set: { saveData: parsed, savedAt: Date.now() } }
    );
    res.send('1');
  } catch(e) {
    console.error('Save error:', e.message);
    res.send('-1');
  }
});

// LOAD DATA
app.post('/loadData.php', async (req, res) => {
  try {
    const username = (req.body.username || '').trim();
    if (!username) return res.send('-1');
    const users = await getUsers();
    const user = await users.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i') } });
    if (!user || !user.saveData) return res.send('-1');
    res.json(user.saveData);
  } catch(e) {
    console.error('Load error:', e.message);
    res.send('-1');
  }
});

app.get('/',       (req, res) => res.send('Backend running ✅'));
app.head('/',      (req, res) => res.sendStatus(200));
app.get('/health', (req, res) => res.sendStatus(200));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
