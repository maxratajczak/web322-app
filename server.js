const { json } = require("express");
const express = require("express");
const path = require("path");
const dataService = require("./data-service.js");

//Creating app with express module
var app = express();
app.use(express.static('public'));

//Creating port
var PORT = process.env.PORT || 8080;

function onStart() {
    console.log("Express http server listening on " + PORT);

    dataService.initialize().then((data) => {
        console.log(data);
    }).catch((err) => {
        throw err;
    });
    
}

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/employees", function(req, res) {
    dataService.getAllEmployees().then((employees) => {
        res.json(employees);
    }).catch((err) => {
        res.json(err);
    });
});

app.get("/managers", function(req, res) {
    dataService.getAllManagers().then((managers) => {
        res.json(managers);
    }).catch((err) => {
        res.json(err);
    });
});

app.get("/departments", function(req, res) {
    dataService.getAllDepartments().then((departments) => {
        res.json(departments);
    }).catch((err) => {
        res.json(err);
    });
});

app.listen(PORT, dataService.initialize().then(() => {
    onStart();
}).catch((err) => {
    console.log(err);
}));

