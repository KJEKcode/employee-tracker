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
            "Update Employee Role",
            "Exit"
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

            case "Exit": 
                exit();
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
              type: "list",
              choices: results.map(dept => ({name: dept.dept_name, value: dept.id})),
              message: "What department does this role go under?"
            }
          ])
          .then(function(answer) {
            var query = connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department
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
    connection.query("SELECT id, first_name, last_name FROM employee", function(err, empResults) {
        connection.query("SELECT id, title FROM role", function(err, roleResults) {
            if (err) throw err;

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
                  type: "list",
                  choices: roleResults.map(roleItem => ({name: roleItem.title, value: roleItem.id})),
                  message: "What is this employees role?"
                },
                {
                    name: "manager",
                    type: "list",
                    choices: empResults.map(managerItem => ({name: `${managerItem.first_name} ${managerItem.last_name}`, value: managerItem.id})),
                    message: "Who is this employees manager?"
                }
            ])
            .then(function(answer) {
                var query = connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: answer.role,
                        manager_id: answer.manager,
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
    });
};

function viewDepartment() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dept_name, role.salary, CONCAT(m.first_name, ', ', m.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee m ON employee.manager_id=m.id ORDER BY dept_name", function(err, results) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(results);
        start();
    })
};

function viewRole() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dept_name, role.salary, CONCAT(m.first_name, ', ', m.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee m ON employee.manager_id=m.id ORDER BY role.title", function(err, results) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(results);
        start();
    })
};

function viewEmployee() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dept_name, role.salary, CONCAT(m.first_name, ', ', m.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee m ON employee.manager_id=m.id", function(err, results) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(results);
        start();
    })
};

function updateRole() {
    connection.query("SELECT id, first_name, last_name FROM employee", function(err, empResults) {
    connection.query("SELECT id, title FROM role", function(err, roleResults) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "employeeName",
              type: "list",
              choices: empResults.map(employee => ({name: `${employee.first_name} ${employee.last_name}`, value: employee.id})),
              message: "Which employee would you like to update?"
            },
            {
                name: "role",
                type: "list",
                choices: roleResults.map(role => ({name: role.title, value: role.id})),
                message: "Select the new role"
              },
          ])
          .then(function(answer) {
            var query = connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                    {
                        role_id: answer.role
                    },
                    {
                        id: answer.employeeName
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
      });
};

function exit() {
    console.log("Logging Off...");
    connection.end();
};