var express = require("express");
var dataService = require("./data-service.js");
var path = require("path");

//Creating app with express module
var app = express();
app.use(express.static('public'));

//Creating port
var PORT = process.env.PORT || 8080;

function onStart() {
    console.log("Express http server listening on " + PORT);
    console.log(typeof employeeJSON);
}

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

var employeeJSON = require("./data/employees.json");
app.get("/employees", function(req, res) {
    res.send(employeeJSON);
});

app.get("/managers", function(req, res) {
    //var obj = JSON.parse(employeeJSON);
    console.log(employeeJSON);
});

var departmentsJSON = require("./data/departments.json");
const { type } = require("os");
app.get("/departments", function(req, res) {
    res.send(departmentsJSON);
});

//Starting app
app.listen(PORT, onStart);


