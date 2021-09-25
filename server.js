/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: Max Ratajczak Student ID: 100153204 Date: 2021-09-25 *
* Online (Heroku) Link: https://obscure-citadel-32081.herokuapp.com/
* ********************************************************************************/

const express = require("express");
const path = require("path");
const dataService = require("./data-service.js");

//Creating app with express module
var app = express();
app.use(express.static(__dirname + '/public/'));

//Creating port
var PORT = process.env.PORT || 8080;

function onStart() {
    console.log("Express HTTP server listening on port " + PORT + "...");
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

//Handling any invalid route
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/404.html"));
});

app.listen(PORT, dataService.initialize().then((message) => {
    console.log("\n" + message);
    onStart();
}).catch((err) => {
    console.log(err);
}));

