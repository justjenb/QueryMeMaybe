const inquirer = require("inquirer");
const { connectDatabase, closeConnection } = require("./requests");
const Department = require("./department");
const Role = require("./role");
const Employee = require("./employee");

class CLI {
  constructor() {
    this.answers = [];
    this.department = new Department();
    this.role = new Role();
    this.employee = new Employee();
  }

  async initializeEntities() {
    try {
      const db = await connectDatabase;
      const department = new Department(db);
      const role = new Role(db);
      const employee = new Employee(db);
      return { db, department, role, employee };
    } catch (err) {
      console.error("Failed to initialize database files:", err);
    }
  }

  async run() {
    try {
    const { db } = await this.initializeEntities();
      const mainAnswer = await inquirer.prompt([
        {
          type: "rawlist",
          name: "list",
          message: "What would you like to do?",
          choices: [
            { name: "Manage Departments", value: "Departments" },
            { name: "Manage Roles", value: "Roles" },
            { name: "Manage Employees", value: "Employees" },
            { name: "Exit", value: "Exit" },
          ],
        },
      ]);
      this.answers.push(mainAnswer);

      if (mainAnswer.list === "Departments") {
        await this.manageDepartments();
        await this.run();
      } else if (mainAnswer.list === "Roles") {
        await this.manageRoles();
        await this.run();
      } else if (mainAnswer.list === "Employees") {
        await this.manageEmployees();
        await this.run();
      } else if (mainAnswer.list === "Exit") {
        closeConnection();
        process.exit(0);
      }
    } catch (err) {
      console.log(err);
      console.log("Oops. Something went wrong.");
    }
  }

  // DEPARTMENTS
  async manageDepartments() {
    try {
      const departmentAnswer = await inquirer.prompt([
        {
          type: "rawlist",
          name: "action",
          message: "What would you like to do with departments?",
          choices: [
            { name: "Add Department", value: "add" },
            { name: "Remove Department", value: "remove" },
            { name: "List Departments", value: "list" },
            { name: "Edit Department", value: "edit"}
          ],
        },
      ]);
      this.answers.push(departmentAnswer);
      if (departmentAnswer.action === "add") {
        await this.addDepartment();
      } else if (departmentAnswer.action === "remove") {
        await this.removeDepartment();
      } else if (departmentAnswer.action === "list") {
        await this.listDepartments();
      } else if (departmentAnswer.action === "edit") {
        await this.editDepartment();
      }
    } catch (err) {
      console.log(err);
      console.log("Oops. Something went wrong.");
    }
  }

  async addDepartment() {
    try {
      const { department } = await this.initializeEntities();
      const departmentNameAnswer = await inquirer.prompt([
        {
          type: "text",
          name: "name",
          message: "What is the name of the department you would like to add?",
        },
      ]);
      this.answers.push(departmentNameAnswer);
      await department.createDepartment(departmentNameAnswer.name);
      console.log("Department added:", departmentNameAnswer.name);
      const departments = await department.getDepartments();
      console.table(departments);
    } catch (err) {
      console.error("Failed to add department:", err);
    }
  }

  async listDepartments() {
    try {
      const { department } = await this.initializeEntities();
      const departments = await department.getDepartments();
      console.table(departments);
    } catch (err) {
      console.error("Failed to list departments:", err);
    }
  }

  async removeDepartment() {
    try {
      const { department } = await this.initializeEntities();
      let departments = await department.getDepartments();
      const departmentChoice = await inquirer.prompt([
        {
          type: "rawlist",
          name: "department",
          message: "Select the department to remove:",
          choices: departments.map((dep) => ({
            name: dep.dept_name,
            value: dep.id,
          })),
        },
      ]);
      this.answers.push(departmentChoice);
      await department.deleteDepartment(departmentChoice.department);
      console.log("Department removed:", departmentChoice.department);
      departments = await department.getDepartments();
      console.table(departments);
    } catch (err) {
      console.error("Failed to remove department:", err);
    }
  }

  async editDepartment() {
    try {
      const { department } = await this.initializeEntities();
      let departments = await department.getDepartments();
      const departmentChoice = await inquirer.prompt([
        {
          type: "rawlist",
          name: "department",
          message: "Select the department to edit:",
          choices: departments.map((dep) => ({
            name: dep.dept_name,
            value: dep.id,
          })),
        },
      ]);
      this.answers.push(departmentChoice);
      const editedName = await inquirer.prompt([
        {
          type: "text",
          name: "name",
          message: "Enter the new department name.",
        },
      ]);
      this.answers.push(editedName);
      await department.editDepartmentName(editedName.name, departmentChoice.department);
      console.log("Department edited:", editedName.name);
      departments = await department.getDepartments();
      console.table(departments);
    } catch (err) {
      console.error("Failed to edit department:", err);
    }
  }

  // ROLES
  async manageRoles() {
    try {
      const roleAnswer = await inquirer.prompt([
        {
          type: "rawlist",
          name: "action",
          message: "What would you like to do with roles?",
          choices: [
            { name: "Add Role", value: "add" },
            { name: "Remove Role", value: "remove" },
            { name: "List Roles", value: "list" },
            { name: "Edit Roles", value: "edit" },
          ],
        },
      ]);
      this.answers.push(roleAnswer);
      if (roleAnswer.action === "add") {
        await this.addRole();
      } else if (roleAnswer.action === "remove") {
        await this.removeRole();
      } else if (roleAnswer.action === "list") {
        await this.listRoles();
      } else if (roleAnswer.action === "edit") {
        await this.editRole();
      }
    } catch (err) {
      console.log(err);
      console.log("Oops. Something went wrong.");
    }
  }

  async addRole() {
    try {
      const { department, role } = await this.initializeEntities();
      const departments = await department.getDepartments();
      const roleNameAnswer = await inquirer.prompt([
        {
          type: "text",
          name: "name",
          message: "What is the name of the role you would like to add?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary for this role?",
          validate: (answer) => {
            if (isNaN(answer)) {
              return "Please enter a valid number."
            }
            return true;
          }
        },
        {
          type: "list",
          name: "department",
          message: "What department does this role belong to?",
          choices: departments.map((dep) => ({
            name: dep.dept_name,
            value: dep.id,
          })),
        },
      ]);
      this.answers.push(roleNameAnswer);
      await role.createRole(
        roleNameAnswer.name,
        roleNameAnswer.salary,
        roleNameAnswer.department
      );
      console.log("Role created:", roleNameAnswer.name);
      const roles = await role.getRoles();
      console.table(roles);
    } catch (err) {
      console.error("Failed to add role:", err);
    }
  }

  async removeRole() {
    try {
      const { role } = await this.initializeEntities();
      let roles = await role.getRoles();
      const roleChoice = await inquirer.prompt([
        {
          type: "rawlist",
          name: "role",
          message: "Select the role to remove:",
          choices: roles.map((rle) => ({
            name: rle.title,
            value: rle.id,
          })),
        },
      ]);
      this.answers.push(roleChoice);
      await role.deleteRole(roleChoice.role);
      console.log("Role removed:", roleChoice.role);
      roles = await role.getRoles();
      console.table(roles);
    } catch (err) {
      console.error("Failed to remove role:", err);
    }
  }

  async listRoles() {
    try {
      const { role } = await this.initializeEntities();
      const roles = await role.getRoles();
      console.table(roles);
    } catch (err) {
      console.error("Failed to list role:", err);
    }
  }

  async editRole() {
    try {
      const { role, department } = await this.initializeEntities();
      let roles = await role.getRoles();
      const roleChoice = await inquirer.prompt([
        {
          type: "rawlist",
          name: "role",
          message: "Select the role to edit:",
          choices: roles.map((rle) => ({
            name: rle.title,
            value: rle.id,
          })),
        },
      ]);
      this.answers.push(roleChoice);
      const roleChangeAnswers = await inquirer.prompt([
        {
          type: "confirm",
          name: "name",
          message: "Do you want to edit the role title?",
        },
        {
          type: "confirm",
          name: "salary",
          message: "Do you want to edit the role salary?",
        },
        {
          type: "confirm",
          name: "department",
          message: "Do you want to edit the role department?",
        },
      ]);
      this.answers.push(roleChangeAnswers);
      if (roleChangeAnswers.name === true) {
        const roleChangeAnswer = await inquirer.prompt([
          {
            type: "text",
            name: "name",
            message: "What is the new title for the role?",
          },
        ]);
        this.answers.push(roleChangeAnswer);
        await role.editRoleName(roleChangeAnswer.name, roleChoice.role);
      }
      if (roleChangeAnswers.salary === true) {
        const roleChangeAnswer = await inquirer.prompt([
          {
            type: "text",
            name: "salary",
            message: "What is the new salary for the role?",
          },
        ]);
        this.answers.push(roleChangeAnswer);
        await role.editRoleSalary(roleChangeAnswer.salary, roleChoice.role);
      }
      if (roleChangeAnswers.department === true) {
        const departments = await department.getDepartments();
        const roleChangeAnswer = await inquirer.prompt([
          {
            type: "list",
            name: "department",
            message: "What department does this role belong to?",
            choices: departments.map((dep) => ({
              name: dep.dept_name,
              value: dep.id,
            })),
          },
        ]);
        this.answers.push(roleChangeAnswer);
        await role.editRoleDepartment(
          roleChangeAnswer.department,
          roleChoice.role
        );
      }
      console.log("Role edited:", roleChoice.role);
      roles = await role.getRoles();
      console.table(roles);
    } catch (err) {
      console.error("Failed to edit role:", err);
    }
  }

  // EMPLOYEES
  async manageEmployees() {
    try {
      const roleAnswer = await inquirer.prompt([
        {
          type: "rawlist",
          name: "action",
          message: "What would you like to do with employees?",
          choices: [
            { name: "Add Employee", value: "add" },
            { name: "Remove Employee", value: "remove" },
            { name: "List Employees", value: "list" },
            { name: "Edit Employees", value: "edit" },
          ],
        },
      ]);
      this.answers.push(roleAnswer);
      if (roleAnswer.action === "add") {
        await this.addEmployee();
      } else if (roleAnswer.action === "remove") {
        await this.removeEmployee();
      } else if (roleAnswer.action === "list") {
        await this.listEmployees();
      } else if (roleAnswer.action === "edit") {
        await this.editEmployee();
      }
    } catch (err) {
      console.log(err);
      console.log("Oops. Something went wrong.");
    }
  }

  async addEmployee() {
    try {
      const { employee, role } = await this.initializeEntities();
      const roles = await role.getRoles();
      const empAddAnswer = await inquirer.prompt([
        {
          type: "text",
          name: "first_name",
          message:
            "What is the first name of the employee you would like to add?",
        },
        {
          type: "text",
          name: "last_name",
          message:
            "What is the last name of the employee you would like to add?",
        },
        {
          type: "list",
          name: "role_id",
          message: "What role does this employee belong to?",
          choices: roles.map((rle) => ({
            name: rle.title,
            value: rle.id,
          })),
        },
        {
          type: "confirm",
          name: "manager",
          message: "Does this employee have a manager?",
        },
      ]);
      this.answers.push(empAddAnswer);
      if (empAddAnswer.manager === true) {
        const employees = await employee.getEmployees();
        const empAddManager = await inquirer.prompt([
          {
            type: "list",
            name: "manager_id",
            message: "Who does this employee report to?",
            choices: employees.map((emp) => ({
              name: emp.first_name + " " + emp.last_name,
              value: emp.id,
            })),
          },
        ]);
        this.answers.push(empAddManager);
        const newEmployeeId = await employee.createEmployee(
          empAddAnswer.first_name,
          empAddAnswer.last_name,
          empAddAnswer.role_id
        );
        
        await employee.editEmployeeManager(empAddManager.manager_id, newEmployeeId);
      } else {
        await employee.createEmployee(
          empAddAnswer.first_name,
          empAddAnswer.last_name,
          empAddAnswer.role_id
        );
      }
      console.log(
        "Employee created:",
        empAddAnswer.first_name + " " + empAddAnswer.last_name
      );
      const employees = await employee.getEmployees();
      console.table(employees);
    } catch (err) {
      console.error("Failed to add employee:", err);
    }
  }

  async removeEmployee() {
    try {
      const { employee } = await this.initializeEntities();
      let employees = await employee.getEmployees();
      const employeeChoice = await inquirer.prompt([
        {
          type: "rawlist",
          name: "employee",
          message: "Select the employee to remove:",
          choices: employees.map((emp) => ({
            name: emp.first_name + " " + emp.last_name,
            value: emp.id,
          })),
        },
      ]);
      this.answers.push(employeeChoice);
      await employee.deleteEmployee(employeeChoice.employee);
      console.log("Employee removed:", employeeChoice.employee);
      employees = await employee.getEmployees();
      console.table(employees);
    } catch (err) {
      console.error("Failed to remove employee:", err);
    }
  }

  async listEmployees() {
    try {
      const { employee } = await this.initializeEntities();
      const employees = await employee.getEmployees();
      console.table(employees);
    } catch (err) {
      console.error("Failed to list role:", err);
    }
  }

  async editEmployee() {
    try {
      const { employee, role } = await this.initializeEntities();
      let employees = await employee.getEmployees();
      const roles = await role.getRoles();
      const empChoice = await inquirer.prompt([
        {
          type: "rawlist",
          name: "employee",
          message: "Select the employee to edit:",
          choices: employees.map((emp) => ({
            name: emp.first_name + " " + emp.last_name,
            value: emp.id,
          })),
        },
      ]);
      this.answers.push(empChoice);
      const empChangeAnswers = await inquirer.prompt([
        {
          type: "confirm",
          name: "name",
          message: "Do you want to edit the employee name?",
        },
        {
          type: "confirm",
          name: "role",
          message: "Do you want to edit the employee role?",
        },
        {
          type: "confirm",
          name: "manager",
          message: "Do you want to edit the employee manager?",
        }
      ]);
      this.answers.push(empChangeAnswers);
      if (empChangeAnswers.name === true) {
        const empChangeAnswers = await inquirer.prompt([
          {
            type: "text",
            name: "first_name",
            message: "What is the first name of the employee?",
          },
          {
            type: "text",
            name: "last_name",
            message: "What is the last name of the employee?",
          },
        ]);
        this.answers.push(empChangeAnswers);
        await employee.editEmployeeName(
          empChangeAnswers.first_name,
          empChangeAnswers.last_name,
          empChoice.employee
        );
        console.log("Name edited:", empChangeAnswers.first_name + " " + empChangeAnswers.last_name);
      }
      if (empChangeAnswers.role === true) {
        const empChangeAnswers = await inquirer.prompt([
          {
            type: "list",
            name: "role",
            message: "What role does this employee need?",
            choices: roles.map((rle) => ({
              name: rle.title,
              value: rle.id,
            })),
          },
        ]);
        this.answers.push(empChangeAnswers);
        await employee.editEmployeeRole(empChangeAnswers.role, empChoice.employee);
        console.log("Employee role edited.");
      }
      if (empChangeAnswers.manager === true) {
        const employees = await employee.getEmployees();
        const empChangeAnswers = await inquirer.prompt([
          {
            type: "list",
            name: "manager_id",
            message: "Who does this employee now report to?",
            choices: employees.map((emp) => ({
              name: emp.id + ": " + emp.first_name + " " + emp.last_name,
              value: emp.id
            })),
          },
        ]);
        this.answers.push(empChangeAnswers);
        await employee.editEmployeeManager(empChangeAnswers.manager_id, empChoice.employee);
      }
      employees = await employee.getEmployees();
      console.table(employees);
    } catch (err) {
      console.error("Failed to edit role:", err);
    }
  }
}

module.exports = CLI;
