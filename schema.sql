DROP DATABASE IF EXISTS business_db;
CREATE database business_db;

USE business_db;

CREATE TABLE department(
	id INTEGER AUTO_INCREMENT NOT NULL,
    dept_name VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE role(
	id INTEGER AUTO_INCREMENT NOT NULL,
	title VARCHAR(30),
    salary DECIMAL(8, 2),
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES department(id),
    PRIMARY KEY(id)
);

CREATE TABLE employee(
	id INTEGER AUTO_INCREMENT NOT NULL,
	first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id),
	PRIMARY KEY(id)
);





INSERT INTO department(dept_name) VALUES("Sales");
INSERT INTO department(dept_name) VALUES("Engineering");
INSERT INTO department(dept_name) VALUES("Finance");
INSERT INTO department(dept_name) VALUES("Legal");

INSERT INTO role(title, salary, department_id) VALUES("Sales Lead", 100000, 1);
INSERT INTO role(title, salary, department_id) VALUES("Salesperson", 80000, 1);
INSERT INTO role(title, salary, department_id) VALUES("Lead Engineer", 150000, 2);
INSERT INTO role(title, salary, department_id) VALUES("Software Engineer", 120000, 2);
INSERT INTO role(title, salary, department_id) VALUES("Lead Accountant", 155000, 3);
INSERT INTO role(title, salary, department_id) VALUES("Accountant", 125000, 3);
INSERT INTO role(title, salary, department_id) VALUES("Legal Team Lead", 250000, 4);
INSERT INTO role(title, salary, department_id) VALUES("Lawyer", 190000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Taylor", "Swift", 1, NULL);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Kim", "Kardashian", 2, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Oprah", "Winfrey", 3, NULL);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Jennifer", "Aniston", 4, 3);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Justin", "Bieber", 5, NULL);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Katy", "Perry", 6, 5);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Angelina", "Jolie", 7, NULL);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Kanye", "West", 8, 7);

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dept_name, role.salary FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id;
