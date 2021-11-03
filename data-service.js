const fs = require('fs');
const employeeJSON = require("./data/employees.json");
const departmentsJSON = require("./data/departments.json");
const { resolve } = require('path');

var employees = [];
var departments = [];

module.exports = {

    initialize: function() {
        return new Promise((resolve, reject) => {

            fs.readFile('./data/employees.json', 'utf8', (err, data) => {
                if (err) reject("Unable to read file");
                
                let obj = JSON.parse(data);
                
                obj.forEach(element => {
                    employees.push(element);
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
    },

    addEmployee: function(employeeData) {
        return new Promise((resolve, reject) => {
            try {
                if(employeeData.isManager === undefined) employeeData.isManager = false;
                else employeeData.isManager = true;
    
                employeeData.employeeNum = employees.length + 1;
                employeeData.department = parseInt(employeeData.department);
                employees.push(employeeData);
                resolve();
            }
            catch(err) {
                reject("Error Adding Employee");
            }
        });
    },

    getEmployeesByStatus: function(status) {
        return new Promise((resolve, reject) => {
            var filteredEmployees = [];
            employees.forEach(element => {
                if(element.status === status) filteredEmployees.push(element);
            });

            if (filteredEmployees.length === 0) reject({message: "No Results Returned"});
            else resolve(filteredEmployees);
        });
    },

    getEmployeesByDepartment: function(department) {
        return new Promise((resolve, reject) => {
            var filteredEmployees = [];
            employees.forEach(element => {
                if(element.department === parseInt(department)) filteredEmployees.push(element);
            });

            if (filteredEmployees.length === 0) reject({message: "No Results Returned"});
            else resolve(filteredEmployees);
        });
    },

    getEmployeesByManager: function(manager) {
        return new Promise((resolve, reject) => {
            var filteredEmployees = [];
            employees.forEach(element => {
                if(element.employeeManagerNum === parseInt(manager)) filteredEmployees.push(element);
            });

            if (filteredEmployees.length === 0) reject({message: "No Results Returned"});
            else resolve(filteredEmployees);
        });
    },

    getEmployeeByNum: function(num) {
        return new Promise((resolve, reject) => {
            var employee = {};
            employees.forEach(element => {
                if(element.employeeNum === parseInt(num)) employee = element;
            });

            if (!employee.employeeNum) reject({message: "No Result Returned"});
            else resolve(employee);
        });
    },

    updateEmployee: function(employeeData) {
        return new Promise((resolve, reject) => {

            employees.forEach(element => {
                if(element.employeeNum === parseInt(employeeData.employeeNum)) {

                    element.firstName = employeeData.firstName;
                    element.lastName = employeeData.lastName;
                    element.email = employeeData.email;
                    element.addressStreet = employeeData.addressStreet;
                    element.addressCity = employeeData.addressCity;
                    element.addressState = employeeData.addressState;
                    element.addressPostal = employeeData.addressPostal;
                    element.isManager = employeeData.isManager;
                    element.employeeManagerNum = employeeData.employeeManagerNum;
                    element.status = employeeData.status;
                    element.department = parseInt(employeeData.department);
                }
            });
            resolve();
        });
    }

}
