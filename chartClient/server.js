const openfinLauncher = require('openfin-launcher');
const express = require('express');
const path = require('path');

const startupApp = "public/app.json";

const app = express();
app.use(express.static('./public'));
app.use(express.static('./dist'));

console.log("Starting server...");
app.listen(5558, () =>{
    console.log("Launching OpenFin app");
    openfinLauncher
        .launchOpenFin({ configPath: path.resolve(startupApp) })
        .catch(err => console.log(err));
});
