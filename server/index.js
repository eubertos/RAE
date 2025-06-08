const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { OpenAI } = require('openai');
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const app = express();
app.use(express.json());

const storageDir = path.join(__dirname, 'uploads');
const upload = multer({ dest: storageDir });

const dbFile = path.join(__dirname, 'db.json');
let db = { users: [], sessions: {}, messages: [] };

function loadDb() {
  try {
    db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  } catch (e) {
    db = { users: [], sessions: {}, messages: [] };
    saveDb();
  }
}

function saveDb() {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

loadDb();

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token || !db.sessions[token]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = db.sessions[token];
  next();
}

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  loadDb();
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  if (db.users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'User exists' });
  }
  db.users.push({ username, password });
  saveDb();
  res.json({ message: 'registered' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  loadDb();
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = crypto.randomBytes(16).toString('hex');
  db.sessions[token] = username;
  saveDb();
  res.json({ token });
});

app.get('/profile', auth, (req, res) => {
  res.json({ username: req.user });
});

app.get('/messages', auth, (req, res) => {
  loadDb();
  res.json(db.messages.filter(m => m.username === req.user));
});

app.post('/messages', auth, (req, res) => {
  const { text } = req.body;
  loadDb();
  const msg = { id: Date.now().toString(), username: req.user, text };
  db.messages.push(msg);
  saveDb();
  res.json(msg);
});

app.post('/mentor', auth, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text' });
  let reply = `You said: ${text}`;
  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: text }],
      });
      reply = completion.choices[0].message.content.trim();
    } catch (e) {
      console.log('openai error', e);
    }
  }
  res.json({ reply });
});

app.post('/files', auth, upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename, original: req.file.originalname });
});

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

module.exports = app;
