const db = require("./requests");

class Department {
  constructor(db) {
    this.db = db;
  }

  getDepartments() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM department`;

      this.db.query(sql, function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  createDepartment(deptName) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO department (dept_name) 
          VALUES (?)`;

      this.db.query(sql, deptName, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
          console.table(results);
        }
      });
    });
  }

  deleteDepartment(deptName) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM department WHERE id = ?`;
  
      this.db.query(sql, deptName, (err, results) => {
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

module.exports = Department;
