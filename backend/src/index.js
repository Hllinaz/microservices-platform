const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Backend Manager",
    timestamp: new Date()
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Backend Manager running on port ${PORT}`);
});