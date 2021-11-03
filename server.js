/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Max Ratajczak Student ID: 100153204 Date: November 4, 2021
*
* Online (Heroku) Link: https://obscure-citadel-32081.herokuapp.com/
*
********************************************************************************/

const fs = require('fs');
const express = require("express");
const multer = require("multer");
const path = require("path");
const dataService = require("./data-service.js");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

var app = express();
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', '.hbs');

app.engine('.hbs', exphbs({
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
           }
    }
}));

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

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
   });   

app.get("/", function(req, res) {
    res.render(path.join(__dirname, "/views/home.hbs"));
});

app.get("/about", function(req, res) {
    res.render(path.join(__dirname, "/views/about.hbs"));
});

/***** EMPLOYEES *****/
app.get("/employees", function(req, res) {
    if(req.query.status) {
        dataService.getEmployeesByStatus(req.query.status).then((empArray) => {
            res.render(path.join(__dirname, "/views/employees.hbs"), {employees: empArray});
        }).catch((err) => {
            res.render(path.join(__dirname, "/views/employees.hbs"), {message: err});
        });
    }
    else if(req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department).then((empArray) => {
            res.render(path.join(__dirname, "/views/employees.hbs"), {employees: empArray});
        }).catch((err) => {
            res.render(path.join(__dirname, "/views/employees.hbs"), {message: err});
        });
    }
    else if(req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager).then((empArray) => {
            res.render(path.join(__dirname, "/views/employees.hbs"), {employees: empArray});
        }).catch((err) => {
            res.render(path.join(__dirname, "/views/employees.hbs"), {message: err});
        });
    }
    else {
        dataService.getAllEmployees().then((empArray) => {
            res.render(path.join(__dirname, "/views/employees.hbs"), {employees: empArray});
        }).catch((err) => {
            res.render(path.join(__dirname, "/views/employees.hbs"), {message: err});
        });
    }
});

app.get("/employee/:value", function(req, res) {
    dataService.getEmployeeByNum(req.params.value).then((employeeData) => {
        res.render(path.join(__dirname, "/views/employee.hbs"), {employee: employeeData});
    }).catch((err) => {
        res.render(path.join(__dirname, "/views/employee.hbs"), {message: err});
    })
});

app.get("/employees/add", function(req, res) {
    res.render(path.join(__dirname, "/views/addEmployee.hbs"));
});

app.post("/employees/add", function(req, res) {
    dataService.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    }).catch((err) => {
        res.json(err);
    })
});

app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body).then(() => {
        res.redirect("/employees");
    });
});
/*********************/

app.get("/departments", function(req, res) {
    dataService.getAllDepartments().then((departments) => {
        res.render(path.join(__dirname, "/views/departments.hbs"), {departments: departments});
    }).catch((err) => {
        res.render(path.join(__dirname, "/views/departments.hbs"), {message: err});
    });
});

/***** IMAGES *****/
app.get("/images/add", function(req, res) {
    res.render(path.join(__dirname, "/views/addImage.hbs"));
});

app.post("/images/add", upload.single("imageFile"), function(req, res) {
    res.redirect("/images");
});

app.get("/images", function(req, res) {

    fs.readdir(__dirname + "/public/images/uploaded", function(err, items) {
        var imageObj = {};
        var imageArray = [];
        items.forEach(element => {
            imageArray.push(element);
        });
        imageObj.images = imageArray;
        res.render(path.join(__dirname, "/views/images.hbs"), {data: imageObj});
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

