const express = require('express');
const cors = require('cors');
const routes = require('./routes/index.js');
const app = express();
const PORT = 4601;
const HOST = '127.0.0.1';

app.use(cors());

routes(app);

app.listen(PORT, HOST, () => console.log(`App listening on ${HOST}:${PORT}`));