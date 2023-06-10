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
    // this.employee = new Employee();
  }

  async run() {
    try {
      const mainAnswer = await inquirer.prompt([
        {
          type: "rawlist",
          name: "list",
          message: "What would you like to do?",
          choices: [
            { name: "Manage Departments", value: "Departments" },
            { name: "Manage Roles", value: "Roles" },
            { name: "Manage Employees", value: "Employees" },
          ],
        },
      ]);
      this.answers.push(mainAnswer);

      if (mainAnswer.list === "Departments") {
        await this.manageDepartments();
      } else if (mainAnswer.list === "Roles") {
        await this.manageRoles();
      } else if (mainAnswer.list === "Employees") {
        // Handle the task for managing employees
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
      }
    } catch (err) {
      console.log(err);
      console.log("Oops. Something went wrong.");
    }
  }

  async addDepartment() {
    try {
      const db = await connectDatabase;
      const department = new Department(db);
      const departments = await department.getDepartments();

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

      await closeConnection();
    } catch (err) {
      console.error("Failed to add department:", err);
      console.error("Failed to connect to the database:", err);
    }
  }

  async listDepartments() {
    try {
      const db = await connectDatabase;
      const department = new Department(db);
      const departments = await department.getDepartments();
      console.table(departments);

      await closeConnection();
    } catch (err) {
      console.error("Failed to list departments:", err);
      console.error("Failed to connect to the database:", err);
    }
  }

  async removeDepartment() {
    try {
      const db = await connectDatabase;
      const department = new Department(db);
      const departments = await department.getDepartments();

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

      await closeConnection();
    } catch (err) {
      console.error("Failed to remove department:", err);
      console.error("Failed to connect to the database:", err);
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
      const db = await connectDatabase;
      const department = new Department(db);
      const departments = await department.getDepartments();

      const roleNameAnswer = await inquirer.prompt([
        {
          type: "text",
          name: "name",
          message: "What is the name of the role you would like to add?",
        },
        {
          type: "text",
          name: "salary",
          message: "What is the salary for this role?",
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

      const role = new Role(db);
      await role.createRole(
        roleNameAnswer.name, 
        roleNameAnswer.salary, 
        roleNameAnswer.department
        );
      console.log("Role created:", roleNameAnswer.name);

      await closeConnection();
    } catch (err) {
      console.error("Failed to add role:", err);
      console.error("Failed to connect to the database:", err);
    }
  }

  async removeRole() {
    try {
      const db = await connectDatabase;
      const role = new Role(db);
      const roles = await role.getRoles();

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

      await closeConnection();
    } catch (err) {
      console.error("Failed to remove role:", err);
      console.error("Failed to connect to the database:", err);
    }
  }

  async listRoles() {
    try {
      const db = await connectDatabase;
      const role = new Role(db);
      const roles = await role.getRoles();
      console.table(roles);

      await closeConnection();
    } catch (err) {
      console.error("Failed to list role:", err);
      console.error("Failed to connect to the database:", err);
    }
  }

  async editRole() {

    try {
      const db = await connectDatabase;
      const role = new Role(db);
      const roles = await role.getRoles();

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
        }
      ]);
      this.answers.push(roleChangeAnswers);

      if(roleChangeAnswers.name === true) {
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
      if(roleChangeAnswers.salary === true) {
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
      if(roleChangeAnswers.department === true) {
        const db = await connectDatabase;
        const department = new Department(db);
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
          }
        ]);
        this.answers.push(roleChangeAnswer);
        await role.editRoleDepartment(roleChangeAnswer.department, roleChoice.role);
      }

      console.log("Role edited:", roleChoice.role);

      await closeConnection();
    } catch (err) {
      console.error("Failed to edit role:", err);
      console.error("Failed to connect to the database:", err);
    }
  }
}

module.exports = CLI;
