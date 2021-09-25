const fs = require('fs');
const employeeJSON = require("./data/employees.json");
const departmentsJSON = require("./data/departments.json");

var employees = [];
var departments = [];

module.exports = {

    initialize: function() {
        return new Promise((resolve, reject) => {

            fs.readFile('./data/employees.json', 'utf8', (err, data) => { //Reading from file
                if (err) reject("Unable to read file"); //If error, send error to promise
                
                let obj = JSON.parse(data); //Parse read file string to an object
                
                obj.forEach(element => {
                    employees.push(element); //Push object into new array
                });
            });

            fs.readFile('./data/departments.json', 'utf8', (err, data) => {
                if (err) reject("Unable to read file");

                let obj1 = JSON.parse(data);
                
                obj1.forEach(element => {
                    departments.push(element);
                });
            });

            resolve("Reading from files was successful!");
        });
    },

    getAllEmployees: function() {
        return new Promise((resolve, reject) => {
            if (employees.length === 0) reject("No results returned from employees.");
            resolve(employees);
        });
    },

    getAllManagers: function() {
        return new Promise((resolve, reject) => {
            if (employees.length === 0) reject("No results returned from managers.");

            let managers = [];
            employees.forEach(element => {
                if(element.isManager === true) managers.push(element);
            });

            resolve(managers);
        });
    },

    getAllDepartments: function() {
        return new Promise((resolve, reject) => {
            if (departments.length === 0) reject("No results returned from departments.");
            resolve(departments);
        });
    }

}
