const express = require('express');
const router = require('./routers/auth.routes');
const cookieParser = require('cookie-parser');

const app = express();


app.use(express.json());
app.use('/api/auth', router);


module.exports = app;