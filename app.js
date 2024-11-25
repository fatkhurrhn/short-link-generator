const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

const links = {}; // Penyimpanan sementara untuk mapping short URL ke URL asli

// Middleware untuk serve file statis
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Route untuk membuat short link
app.post('/shorten', (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const shortId = crypto.randomBytes(3).toString('hex'); // Membuat ID unik
    links[shortId] = originalUrl;

    res.json({ shortUrl: `http://localhost:${PORT}/${shortId}` });
});

// Route untuk redirect dari short URL
app.get('/:shortId', (req, res) => {
    const shortId = req.params.shortId;
    const originalUrl = links[shortId];

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).send('<h1>Short link not found!</h1>');
    }
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
