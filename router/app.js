const express = require('express');
const app = express.Router();

app.get('/', (req, res) => {
    res.sendFile(express._dirname + "/files/index.html");
});

module.exports = app;