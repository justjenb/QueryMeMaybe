const inquirer = require("inquirer");
const { connectDatabase, closeConnection } = require("./requests");
const Department = require("./department");
const Role = require("./role");
const Employee = require("./employee");

class CLI {
  constructor() {
    this.answers = [];
    this.department = new Department();
    // this.role = new Role();
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
        // Handle the task for managing roles
      } else if (mainAnswer.list === "Employees") {
        // Handle the task for managing employees
      }
    } catch (err) {
      console.log(err);
      console.log("Oops. Something went wrong.");
    }
  }

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
    const departmentNameAnswer = await inquirer.prompt([
      {
        type: "text",
        name: "setname",
        message: "What is the name of the department you would like to add?",
      },
    ]);
    this.answers.push(departmentNameAnswer);

    connectDatabase
      .then((db) => {
        const department = new Department(db);
        department.createDepartment(departmentNameAnswer.setname)
          .then((result) => {
            console.log("Department created:", result);
          })
          .catch((err) => {
            console.error(err);
          });
        closeConnection();
      })
      .catch((err) => {
        console.error("Failed to connect to the database:", err);
      });
  }

  async listDepartments() {
    connectDatabase
      .then((db) => {
        const department = new Department(db);
        department
          .getDepartments()
          .then((departments) => {
            console.log(departments);
          })
          .catch((err) => {
            console.error(err);
          });

        closeConnection();
      })
      .catch((err) => {
        console.error("Failed to connect to the database:", err);
      });
  }
}

module.exports = CLI;
