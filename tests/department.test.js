const { closeConnection } = require('../lib/requests');
const Department = require('../lib/department');
  
describe("Departments", () => {

    describe("Instantiate Department", () => {
        it("creates an instance of department", () => {
          const department = new Department();
          expect(department).toBeInstanceOf(Department);
          closeConnection();
        });
      });

      describe("Create New Department", () => {
        it("creates a test department", async () => {
          const department = new Department();
          const newDeptName = "Automation Department";
          const newDept = await department.createDepartment(newDeptName);
    
          expect(newDept).toBeTruthy();
          expect(newDept.dept_name).toBe(newDeptName);
          closeConnection();
        });
      });

      describe("Get Departments", () => {
        it("returns departments from the database", async () => {
          const department = new Department();
          const departments = await department.getDepartments();
    
          expect(Array.isArray(departments)).toBe(true);
          expect(departments.length).toBeGreaterThan(0);
          closeConnection();
        });
      });
});