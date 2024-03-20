require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();

app.use(cors()); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB connection is successful"))
  .catch((error) => console.log("DB connection is unsuccessful", error));

const codeSnippetSchema = new mongoose.Schema({
  username: String,
  language: String,
  stdin: String,
  source_code: String,
  timestamp: { type: Date, default: Date.now }
});

// Create model based on schema
const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema);

// Endpoint to fetch all code snippets
app.get("/app/check", (req, res) => {
  //console.log("Client has made a api request");
  res.json({
    service: "Assingment Backend API Server",
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

// Endpoint to submit a new code snippet
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

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Backend server is started at http://${HOST}:${PORT}`);
});
