const express = require('express');
const app = express();

const _PORT = process.env.PORT || 3000;
express._dirname = __dirname;
app.use(require("./router/app"));
app.use("/download", require("./router/download"));
app.use('/static', express.static("files/static"));
app.listen(_PORT, function() {
    console.log("[HTTP] Listening on PORT " + _PORT);
});