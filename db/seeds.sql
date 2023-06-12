INSERT INTO department (dept_name)
VALUES ("Management"),
       ("Customer Service"),
       ("Sales"),
       ("Operations"),
       ("Projects");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 130000, 1),
       ("Customer Service Manager", 70000, 2),
       ("Sales Manager", 80000, 3),
       ("Operations Manager", 80000, 4),
       ("Project Manager", 60000, 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Doe", 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jane", "Smith", 2, 1),
       ("Bob", "Johnson", 3, 1),
       ("Alice", "Williams", 4, 1),
       ("Charlie", "Brown", 5, 1);