const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const print = require('./lib/print');

const app = express();
const PORT = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.raw({
  type: "image/png"
}));

app.post('/print', (req, res) => {
  print(req.body, () => {
    res.sendStatus(200)
  });
});

app.listen(PORT, () => console.log(`Print server listening on port ${PORT}`));