require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Compass connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/assignment';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("DB connection is successful"))
.catch((error) => console.log("DB connection is unsuccessful", error));

const codeSnippetSchema = new mongoose.Schema({
  username: String,
  language: String,
  stdin: String,
  source_code: String,
  timestamp: { type: Date, default: Date.now }
});

const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema);

app.get("/app/check", (req, res) => {
  res.json({
    service: "Assignment Backend API Server",
    active: true,
    time: new Date(),
  });
});
  
app.get('/app/entries', async (req, res) => {
  try {
    const entries = await CodeSnippet.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/app/submit', async (req, res) => {
  const codeSnippet = new CodeSnippet({
    username: req.body.username,
    language: req.body.language,
    stdin: req.body.stdin,
    source_code: req.body.source_code
  });
  
  try {
    const newCodeSnippet = await codeSnippet.save();
    res.status(201).json(newCodeSnippet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Backend server is started on port ${PORT}`);
});
