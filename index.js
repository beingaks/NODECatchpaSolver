const express = require('express');
const request = require('request-promise');
const Tesseract = require('tesseract.js');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/solve-captcha', async (req, res) => {
  try {
    const captchaUrl = req.query.url;
    if (!captchaUrl) {
      return res.status(400).send('Captcha URL is required.');
    }

    // Send HTTP request to the captcha image URL
    const image = await request.get({url: captchaUrl, encoding: null});
    
    // Convert the image to text using Tesseract.js
    const { data: { text } } = await Tesseract.recognize(image);

    res.send({ captcha: text });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});