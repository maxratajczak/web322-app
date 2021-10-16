/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: Max Ratajczak Student ID: 100153204 Date: 2021-09-25 *
* Online (Heroku) Link: https://obscure-citadel-32081.herokuapp.com/
* ********************************************************************************/

const fs = require('fs');
const express = require("express");
const multer = require("multer");
const path = require("path");
const dataService = require("./data-service.js");
const bodyParser = require("body-parser");

var app = express();
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: true }));

var PORT = process.env.PORT || 8080;

function onStart() {
    console.log("Express HTTP server listening on port " + PORT + "...");
}

//Multer file handling

const storage = multer.diskStorage({
    destination: "public/images/uploaded",
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

/***** EMPLOYEES *****/
app.get("/employees", function(req, res) {
    if(req.query.status) {
        dataService.getEmployeesByStatus(req.query.status).then((empArray) => {
            res.json(empArray);
        }).catch((err) => {
            res.json(err);
        });
    }
    else if(req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department).then((empArray) => {
            res.json(empArray);
        }).catch((err) => {
            res.json(err);
        });
    }
    else if(req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager).then((empArray) => {
            res.json(empArray);
        }).catch((err) => {
            res.json(err);
        });
    }
    else {
        dataService.getAllEmployees().then((employees) => {
            res.json(employees);
        }).catch((err) => {
            res.json(err);
        });
    }
});

app.get("/employee/:value", function(req, res) {
    dataService.getEmployeeByNum(req.params.value).then((employee) => {
        res.json(employee);
    }).catch((err) => {
        res.json(err);
    })
});

app.get("/employees/add", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
});

app.post("/employees/add", function(req, res) {
    dataService.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    }).catch((err) => {
        res.json(err);
    })
});
/*********************/

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

/***** IMAGES *****/
app.get("/images/add", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), function(req, res) {
    res.redirect("/images");
});

app.get("/images", function(req, res) {

    fs.readdir(__dirname + "/public/images/uploaded", function(err, items) {
        var imageObj = {};
        let imageArray = [];
        items.forEach(element => {
            imageArray.push(element);
        });
        imageObj.images = imageArray;
        res.json(imageObj)
    });
    
});
/******************/

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

