const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "root",
    database: "business_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    start();
  });

  // function which prompts the user for what action they should take
function start() {
    inquirer
      .prompt({
        name: "mainMenu",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Add Department",
            "Add Role",
            "Add Employee",
            "View All Employees By Department",
            "View All Employees By Role",
            "View All Employees",
            "Update Employee Role"
        ]
      })
      .then(function(answer) {
        switch (answer.mainMenu) {
            case "Add Department": 
                addDepartment();
                break;

            case "Add Role": 
                addRole();
                break;

            case "Add Employee": 
                addEmployee();
                break;

            case "View All Employees By Department": 
                viewDepartment();
                break;

            case "View All Employees By Role": 
                viewRole();
                break;

            case "View All Employees": 
                viewEmployee();
                break;

            case "Update Employee Role": 
                updateRole();
                break;
        
            default:
                viewEmployee();
                break;
        }
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            name: "newDept",
            type: "input",
            message: "What is the name of the new department?"
        }
    ]).then(answer => {
        var query = connection.query(
            "INSERT INTO department SET ?",
            {
              dept_name: answer.newDept
            },
            function(err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " Department Added!\n");
              // Call updateProduct AFTER the INSERT completes
              start();
            }
        );
    });
};

function addRole() {
    connection.query("SELECT * FROM department", function(err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
          .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title for this role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary for this role?"
            },
            {
              name: "department",
              type: "rawlist",
              choices: results.map(dept => dept.dept_name),
              message: "What department does this role go under?"
            }
          ])
          .then(function(answer) {
            var query = connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: function() {
                        for (let i = 0; i < results.length; i++) {
                            if (answer.department === results.dept_name) {
                                answer.department = results[i].id;
                            }
                        }
                    }
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " Role Added!\n");
                    // Call updateProduct AFTER the INSERT completes
                    start();
                }
            )
          });
      });
};

function addEmployee() {
    connection.query("SELECT * FROM role", function(err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
          .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the employees first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employees last name?"
            },
            {
              name: "role",
              type: "rawlist",
              choices: results.map(role => role.title),
              message: "What is this employees role?"
            },
            {
                name: "manager",
                type: "input",
                message: "Enter manager Id"
            }
          ])
          .then(function(answer) {
            var query = connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    manager_id: answer.manager,
                    role_id: function() {
                        for (let i = 0; i < results.length; i++) {
                            if (answer.role === results.title) {
                                answer.role = results[i].id;
                            }
                        }
                    }
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " Employee Added!\n");
                    // Call updateProduct AFTER the INSERT completes
                    start();
                }
            )
          });
      });
};

function viewDepartment() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dept_name, role.salary FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id ORDER BY dept_name", function(err, results) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(results);
        start();
    })
};
function viewRole() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dept_name, role.salary FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id ORDER BY role.title", function(err, results) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(results);
        start();
    })
};

function viewEmployee() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dept_name, role.salary FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id", function(err, results) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(results);
        start();
    })
};

function updateRole() {
    connection.query("SELECT * FROM employee, role", function(err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
          .prompt([
            {
              name: "employeeName",
              type: "rawlist",
              choices: results.map(employee => `${employee.first_name}`),
              message: "Which employee would you like to update?"
            },
            {
                name: "role",
                type: "rawlist",
                choices: results.map(role => role.title),
                message: "Select new role?"
              },
          ])
          .then(function(answer) {
            var query = connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                    {
                        role_id: function() {
                            for (let i = 0; i < results.length; i++) {
                                if (answer.role === results.title) {
                                    answer.role = results[i].id;
                                }
                            }
                        }
                    },
                    {
                        first_name: answer.employeeName
                    }
                ],
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " Employee updated!\n");
                    // Call updateProduct AFTER the INSERT completes
                    start();
                }
            )
          });
      });
};