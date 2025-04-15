process.chdir(__dirname);
console.log("Running from:", process.cwd());

require('dotenv').config({ path: './.env' });

const express = require('express');
const fetch = require('node-fetch');  // node-fetch version 2.x.x
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); 

const apiKey = process.env.API_KEY;
if (!apiKey) { // debug
    console.error("API_KEY is missing! Check your .env file.");
    process.exit(1);
}

app.post('/run-code', async (req, res) => {
    const { sourceCode, languageId } = req.body;

    const apiUrl = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";

    await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": apiKey 
        },
        body: JSON.stringify({
            language_id: languageId,
            source_code: sourceCode
        })
    })
    .then(response => response.json())
    .then(data => {
        res.json(data);
    })
    .catch(error => {
        res.status(500).json({ error: "Error running code" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));