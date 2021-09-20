var express = require("express");
var path = require("path");
app.use(express.static('public'));

//Creating app with express module
var app = express();

//Creating port
var PORT = process.env.PORT || 8080;

//Starting app
app.listen(PORT, onStart);

function onStart() {
    console.log("Express http server listening on " + PORT);
}

app.get("/", function(req, res) {
    response.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", function(req, res) {
    response.sendFile(path.join(__dirname, "/views/about.html"));
});


