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
  
      await department.createDepartment(departmentNameAnswer.name)
      console.log("Department added:", departmentNameAnswer.name);

      await closeConnection();
    } catch (err) {
      console.error("Failed to remove department:", err);
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
      console.error("Failed to remove department:", err);
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
          choices: departments.map((dep) => dep.dept_name),
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
}

module.exports = CLI;
