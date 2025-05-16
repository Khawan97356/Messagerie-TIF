const express = require('express');
const app = express();

app.use(express.json());

app.post('/test', (req, res) => {
  console.log('Body reçu:', req.body);
  res.json({ message: 'Test réussi', reçu: req.body });
});

app.listen(3000, () => console.log('Test server running on port 3000'));