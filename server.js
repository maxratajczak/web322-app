/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students.
*
* Name: Max Ratajczak Student ID: 100153204 Date: November 30, 2021
*
* Online (Heroku) Link: https://obscure-citadel-32081.herokuapp.com/
*
********************************************************************************/

const fs = require('fs');
const express = require("express");
const multer = require("multer");
const path = require("path");
const dataService = require("./data-service.js");
const dataServiceAuth = require("./data-service-auth.js");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const clientSessions = require("client-sessions");

var app = express();
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(clientSessions({
    cookieName: "session",
    secret: "web322assignment6secretcookiecode",
    duration: 2 * 60 * 100,
    activeDuration: 1000 * 60
}));

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
            } 
            else {
                return options.fn(this);
            }
        }
    }
}));

var PORT = process.env.PORT || 8080;

function onStart() {
    console.log("Express HTTP server listening on port " + PORT + "...");
}

const storage = multer.diskStorage({
    destination: "public/images/uploaded",
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});

function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
  }

app.use(function(req, res, next) { 
    res.locals.session = req.session;
    next();
});

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
app.get("/employees", ensureLogin, function(req, res) {
    if(req.query.status) {
        dataService.getEmployeesByStatus(req.query.status)
        .then((empArray) => {
            if (empArray.length != 0) {
                res.render(path.join(__dirname, "/views/employees.hbs"), {employees: empArray});
            }
            else {
                res.render(path.join(__dirname, "/views/employees.hbs"), {message: "No Results"});
            }
            
        }).catch((err) => {
            res.render(path.join(__dirname, "/views/employees.hbs"), {message: err});
        });
    }
    else if(req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department)
        .then((empArray) => {
            if (empArray.length != 0) {
                res.render(path.join(__dirname, "/views/employees.hbs"), {employees: empArray});
            }
            else {
                res.render(path.join(__dirname, "/views/employees.hbs"), {message: "No Results"});
            }
            
        }).catch((err) => {
            res.render(path.join(__dirname, "/views/employees.hbs"), {message: err});
        });
    }
    else if(req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager)
        .then((empArray) => {
            if (empArray.length != 0) {
                res.render(path.join(__dirname, "/views/employees.hbs"), {employees: empArray});
            }
            else {
                res.render(path.join(__dirname, "/views/employees.hbs"), {message: "No Results"});
            }
        }).catch((err) => {
            res.render(path.join(__dirname, "/views/employees.hbs"), {message: err});
        });
    }
    else {
        dataService.getAllEmployees()
        .then((empArray) => {
            if (empArray.length != 0) {
                res.render(path.join(__dirname, "/views/employees.hbs"), {employees: empArray});
            }
            else {
                res.render(path.join(__dirname, "/views/employees.hbs"), {message: "No Results"});
            }
        }).catch((err) => {
            res.render(path.join(__dirname, "/views/employees.hbs"), {message: err});
        });
    }
});

app.get("/employee/:empNum", ensureLogin, (req, res) => {
	// initialize an empty object to store the values
	let viewData = {};
	dataService.getEmployeeByNum(req.params.empNum).then((data) => {
			if (data){
				viewData.employee = data; //store employee data in the "viewData" object as "employee"
			}
			else{
				viewData.employee = null; // set employee to null if none were returned
			}
		}).catch(() =>{
			viewData.employee = null; // set employee to null if there was an error
		}).then(dataService.getAllDepartments)
		.then((data) =>{
			viewData.departments = data; // store department data in the "viewData" object as "departments"
			// loop through viewData.departments and once we have found the departmentId that matches
			// the employee's "department" value, add a "selected" property to the matching
			// viewData.departments object
			for (let i = 0; i < viewData.departments.length; i++){
				if (viewData.departments[i].departmentId == viewData.employee.department){
					viewData.departments[i].selected = true;
				}
			}
		}).catch(() =>{
			viewData.departments = []; // set departments to empty if there was an error
		}).then(() =>{
			if (viewData.employee == null){ // if no employee - return an error
				res.status(404).send("Employee Not Found");
			}
			else{
				res.render(path.join(__dirname, "/views/employee.hbs"), {viewData: viewData}); // render the "employee" view
			}
		});
});

app.get("/employees/add", ensureLogin, function(req, res) {
    dataService.getAllDepartments()
    .then((data) => {
        res.render(path.join(__dirname, "/views/addEmployee.hbs"), {departments: data});
    }).catch((err) => {
        res.render(path.join(__dirname, "/views/addEmployee.hbs"), {departments: []});
    })
    
});

app.post("/employees/add", ensureLogin, function(req, res) {
    dataService.addEmployee(req.body)
    .then(() => {
        res.redirect("/employees");
    }).catch((err) => {
        res.json(err);
    });
});

app.post("/employee/update", ensureLogin, (req, res) => {
    dataService.updateEmployee(req.body)
    .then(() => {
        res.redirect("/employees");
    }).catch((err) => {
        res.json(err);
    });
});

app.get("/employees/delete/:empNum", ensureLogin, function(req, res) {
    dataService.deleteEmployeeByNum(req.params.empNum)
    .then(() => {
        res.redirect("/employees");
    }).catch((err) => {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    });
});
/*********************/

/***** DEPARTMENTS *****/
app.get("/departments", ensureLogin, function(req, res) {
    dataService.getAllDepartments()
    .then((departments) => {
        if (departments.length != 0) {
            res.render(path.join(__dirname, "/views/departments.hbs"), {departments: departments});
        }
        else {
            res.render(path.join(__dirname, "/views/departments.hbs"), {message: "No Results"});
        }
        
    }).catch((err) => {
        res.render(path.join(__dirname, "/views/departments.hbs"), {message: err});
    });
});

app.get("/departments/add", ensureLogin, function(req, res) {
    res.render(path.join(__dirname, "/views/addDepartment.hbs"));
});

app.post("/departments/add", ensureLogin, function(req, res) {
    dataService.addDepartment(req.body)
    .then(() => {
        res.redirect("/departments");
    }).catch((err) => {
        res.json(err);
    });
});

app.post("/department/update", ensureLogin, (req, res) => {
    dataService.updateDepartment(req.body)
    .then(() => {
        res.redirect("/departments");
    }).catch((err) => {
        res.json(err);
    });
});

app.get("/department/:departmentId", ensureLogin, function(req, res) {
    dataService.getDepartmentById(req.params.departmentId)
    .then((departmentData) => {
        if (departmentData.length != 0) {
            res.render(path.join(__dirname, "/views/department.hbs"), {department: departmentData});
        }
        else {
            res.status(404).send("Department Not Found");
        }
    }).catch((err) => {
        res.render(path.join(__dirname, "/views/department.hbs"), {message: err});
    });
});

app.get("/departments/delete/:departmentId", ensureLogin, function(req, res) {
    dataService.deleteDepartmentById(req.params.departmentId)
    .then(() => {
        res.redirect("/departments");
    }).catch((err) => {
        res.status(500).send("Unable to Remove Department / Department not found");
    });
});
/***********************/

/***** IMAGES *****/
app.get("/images/add", ensureLogin, function(req, res) {
    res.render(path.join(__dirname, "/views/addImage.hbs"));
});

app.post("/images/add", ensureLogin, upload.single("imageFile"), function(req, res) {
    res.redirect("/images");
});

app.get("/images", ensureLogin, function(req, res) {

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

/***** LOGIN *****/
app.get("/login", function(req, res) {
    res.render(path.join(__dirname, "/views/login.hbs"));
});
app.post("/login", function(req, res) {
    req.body.userAgent = req.get('User-Agent');
    dataServiceAuth.checkUser(req.body)
    .then((user) => {
        req.session.user = {
            userName: user.userName,
            email: user.email,
            loginHistory: user.loginHistory
        }
        res.redirect("/employees");
    })
    .catch((err) => {
        res.render(path.join(__dirname, "/views/login.hbs"), {errorMessage: err, userName: req.body.userName});
    });
});

app.get("/register", function(req, res) {
    res.render(path.join(__dirname, "/views/register.hbs"));
});
app.post("/register", function(req, res) {
    dataServiceAuth.registerUser(req.body)
    .then(() => {
        res.render(path.join(__dirname, "/views/register.hbs"), {successMessage: "User Created."});
    })
    .catch((err) => {
        res.render(path.join(__dirname, "/views/register.hbs"), {errorMessage: err, userName: req.body.userName});
    })
});

app.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/");
})

app.get("/userHistory", ensureLogin, function(req, res) {
    res.render(path.join(__dirname, "/views/userHistory.hbs"));
})
/*****************/

//Handling any invalid route
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/404.html"));
});

dataService.initialize()
.then(dataServiceAuth.initialize()
.then(() => {
    app.listen(PORT, () => {
        onStart();
    });
})
.catch((err) => {
    console.log("Unable to start server: " + err);
}));
