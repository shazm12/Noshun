const express = require('express');
const connectToMongo = require('./config/db');
var cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

connectToMongo();

app.use(express.json());
app.use(cors());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Noshun backend running at http://localhost:${port}`);
});
