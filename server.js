var express = require("express");
var path = require("path");

//Creating app with express module
var app = express();
app.use(express.static('public'));

//Creating port
var PORT = process.env.PORT || 8080;

function onStart() {
    console.log("Express http server listening on " + PORT);
}

app.get("/", function(req, res) {
    response.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", function(req, res) {
    response.sendFile(path.join(__dirname, "/views/about.html"));
});

//Starting app
app.listen(PORT, onStart);


