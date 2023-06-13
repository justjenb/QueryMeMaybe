const inquirer = require("inquirer");
const { connectDatabase, closeConnection } = require("../lib/requests");
const Department = require("../lib/department");
const Role = require("../lib/role");
const Employee = require("../lib/employee");
  
describe("Departments", () => {

    describe("Instantiate Department", () => {
        it("creates an instance of department", () => {
          const department = new Department();
          expect(department).toBeInstanceOf(Department);
        });
      });

      describe("Instantiate Employee", () => {
        it("creates an instance of employee", () => {
          const employee = new Employee();
          expect(employee).toBeInstanceOf(Employee);
        });
      });

      describe("Instantiate Role", () => {
        it("creates an instance of department", () => {
          const role = new Role();
          expect(role).toBeInstanceOf(Role);
        });
      });
      closeConnection();
});