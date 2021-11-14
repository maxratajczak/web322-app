const Sequelize = require('sequelize');

var sequelize = new Sequelize('ddvlsg47bjs05p', 'ucxxffktssubne', '577e840b3b97b66ade501626ac37dab703f088bfeda2650f456f359e5af91ec5', {
    host: 'ec2-3-227-149-67.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: { rejectUnauthorized: false }
    }
});

var Employee = sequelize.define("Employee", {
    employeeNum:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
},
{
    createdAt: false,
    updatedAt: false
});

var Department = sequelize.define("Department", {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
},
{
    createdAt: false,
    updatedAt: false
});
Department.hasMany(Employee, {foreignKey: 'department'});

sequelize.authenticate()
.then(() => {
    console.log("\033[0;32mDatabase Connection Successful!\033[0m");
})
.catch(() => {
    console.log("\033[0;31mConnection Unsuccessful.\033[0m");
});

module.exports = {

    initialize: function() {
        return new Promise((resolve, reject) => {

            sequelize.sync()
            .then(() => {
                resolve("\033[0;32mSuccess syncing to the database!\033[0m");
            })
            .catch((err) => {
                reject("\033[0;31mUnable to sync to the database.\033[0m")
            });

        });
    },

    getAllEmployees: function() {
        return new Promise((resolve, reject) => {
            var data = [];

            Employee.findAll({
                order: [
                    ['employeeNum' , 'ASC']
                ]
            })
            .then((employees) => {
                employees.forEach(element => {
                    data.push(element.dataValues);
                });
                resolve(data);
            })
            .catch((err) => {
                reject("No results returned.");
            });

        });
    },

    getAllManagers: function() {
        return new Promise((resolve, reject) => {
            var data = [];

            Employee.findAll({
                where: {
                    isManager: true
                },
                order: [
                    ['employeeNum' , 'ASC']
                ]
            })
            .then((employees) => {
                employees.forEach(element => {
                    data.push(element.dataValues);
                });
                resolve(data);
            })
            .catch((err) => {
                reject("No results returned.");
            });

        });
    },

    getAllDepartments: function() {
        return new Promise((resolve, reject) => {
            var data = [];

            Department.findAll({
                order: [
                    ['departmentId' , 'ASC']
                ]
            })
            .then((departments) => {
                departments.forEach(element => {
                    data.push(element.dataValues);
                });
                resolve(data);
            })
            .catch((err) => {
                reject("No results returned.");
            });

        });
    },

    addEmployee: function(employeeData) {
        return new Promise((resolve, reject) => {

            employeeData.isManager = (employeeData.isManager) ? true : false;
            for (const prop in employeeData) {
                if (employeeData[prop] === "") employeeData[prop] = null;
            }

            Employee.create({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            })
            .then(() => {
                resolve("Employee created.");
            })
            .catch((err) => {
                reject("Unable to create employee.");
            });

        });
    },

    getEmployeesByStatus: function(filterStatus) {
        return new Promise((resolve, reject) => {
            var data = [];

            Employee.findAll({
                where: {
                    status: filterStatus
                },
                order: [
                    ['employeeNum' , 'ASC']
                ]
            })
            .then((employees) => {
                employees.forEach(element => {
                    data.push(element.dataValues);
                });
                resolve(data);
            })
            .catch((err) => {
                reject("No results returned.");
            });

        });
    },

    getEmployeesByDepartment: function(filterDepartment) {
        return new Promise((resolve, reject) => {
            var data = [];

            Employee.findAll({
                where: {
                    department: filterDepartment
                },
                order: [
                    ['employeeNum' , 'ASC']
                ]
            })
            .then((employees) => {
                employees.forEach(element => {
                    data.push(element.dataValues);
                });
                resolve(data);
            })
            .catch((err) => {
                reject("No results returned.");
            });

        });
    },

    getEmployeesByManager: function(filterManager) {
        return new Promise((resolve, reject) => {
            var data = [];

            Employee.findAll({
                where: {
                    employeeManagerNum: filterManager
                },
                order: [
                    ['employeeNum' , 'ASC']
                ]
            })
            .then((employees) => {
                employees.forEach(element => {
                    data.push(element.dataValues);
                });
                resolve(data);
            })
            .catch((err) => {
                reject("No results returned.");
            });

        });
    },

    getEmployeeByNum: function(num) {
        return new Promise((resolve, reject) => {

            Employee.findAll({
                where: {
                    employeeNum: num
                }
            })
            .then((employee) => {
                resolve(employee[0].dataValues);
            })
            .catch((err) => {
                reject("No results returned.");
            });

        });
    },

    updateEmployee: function(employeeData) {
        return new Promise((resolve, reject) => {

            employeeData.isManager = (employeeData.isManager) ? true : false;
            for (const prop in employeeData) {
                if (employeeData[prop] === "") employeeData[prop] = null;
            }

            Employee.update({
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            },
            {
                where: {employeeNum: employeeData.employeeNum}
            })
            .then(() => {
                resolve("Employee updated.");
            })
            .catch((err) => {
                reject("Unable to update employee.");
            });

        });
    },

    addDepartment: function(department) {
        return new Promise((resolve, reject) => {

            for (const prop in department) {
                if (department[prop] === "") department[prop] = null;
            }
    
            Department.create({
                departmentId: department.departmentId,
                departmentName: department.departmentName
            })
            .then(() => {
                resolve("Department created.");
            })
            .catch((err) => {
                reject("Unable to create department.")
            });

        });
    },

    updateDepartment: function(department) {
        return new Promise((resolve, reject) => {

            Department.update({
                departmentName: department.departmentName
            },
            {
                where: {departmentId: department.departmentId}
            })
            .then(() => {
                resolve("Department updated.");
            })
            .catch((err) => {
                reject("Unable to update department.");
            });

        });
    },

    getDepartmentById: function(id) {
        return new Promise((resolve, reject) => {

            Department.findAll({
                where: {
                    departmentId: id
                }
            })
            .then((department) => {
                resolve(department[0].dataValues);
            })
            .catch((err) => {
                reject("No results returned.");
            });

        });
    },

    deleteDepartmentById: function(id) {
        return new Promise((resolve, reject) => {

            Department.destroy({
                where: { departmentId: id }
            })
            .then(() => {
                resolve("Department deleted.");
            })
            .catch((err) => {
                reject("Department could not be deleted.")
            });
            
        });
    },

    deleteEmployeeByNum: function(empNum) {
        return new Promise ((resolve, reject) => {
            
            Employee.destroy({
                where: { employeeNum: empNum }
            })
            .then(() => {
                resolve("Employee deleted.");
            })
            .catch((err) => {
                reject("Employee could not be deleted.")
            });

        });
    }

}
