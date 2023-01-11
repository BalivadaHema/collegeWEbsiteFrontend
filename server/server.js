import cors from "cors";
import express, { json } from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

// Create express app
const app = express();

// Middlewares
app.use(cors());
app.use(json());

// Get language code and version according to JDoodle API
const languagesMap = {
  cpp: ["cpp14", "3"],
  c: ["c", "3"],
  java: ["java", "1"],
  python: ["python3", "3"],
};

// Post request to create submission
app.post("/api/submission", async (req, res) => {
  try {
    const [language, versionIndex] = languagesMap[req.body.language];

    const inputParams = {
      ...req.body,
      language,
      versionIndex,
      clientId: "bc681666a8ee6c0e09c5425b69d2e0a3",
      clientSecret: "7a224aa8fa2046bc5b1e8a46a1915079293edef0aca2e786532becc09d2ef551",
    };

    const resp = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "post",
      body: JSON.stringify(inputParams),
      headers: { "Content-type": "application/json" },
    });

    const data = await resp.json();

    res.status(200).json(data);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started at port ${port}`));
