const db = require("./requests");

class Employee {
  constructor(db) {
    this.db = db;
  }

  getEmployees() {
    return new Promise((resolve, reject) => {
      const sql = `
      SELECT e1.id, e1.first_name, e1.last_name, r.title, d.dept_name, r.salary, 
      CONCAT(e2.first_name, ' ', e2.last_name) AS manager
      FROM employee e1
      INNER JOIN role r ON e1.role_id = r.id
      INNER JOIN department d ON r.department_id = d.id
      LEFT JOIN employee e2 ON e1.manager_id = e2.id;
      `;

      this.db.query(sql, function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  createEmployee(firstName, lastName, roleId) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO employee (first_name, last_name, role_id) 
          VALUES (?, ?, ?)`;

      this.db.query(sql, [firstName, lastName, roleId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.table(results);
          resolve(results.insertId);
        }
      });
    });
  }

  deleteEmployee(employeeId) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM employee WHERE id = ?`;

      this.db.query(sql, employeeId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
          console.table(results);
        }
      });
    });
  }

  editEmployeeName(firstName, lastName, employeeId) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE employee SET first_name = ?, last_name = ?
        WHERE id = ?`;

      this.db.query(sql, [firstName, lastName, employeeId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
          console.table(results);
        }
      });
    });
  }

  editEmployeeRole(roleId, employeeId) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

      this.db.query(sql, [roleId, employeeId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
          console.table(results);
        }
      });
    });
  }

  editEmployeeManager(empManager, employeeId) {
    return new Promise((resolve, reject) => {
    const sql = `
      UPDATE employee SET manager_id = ? WHERE id = ?
    `;

      this.db.query(sql, [empManager, employeeId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
          console.table(results);
        }
      });
    });
  }
}

module.exports = Employee;
