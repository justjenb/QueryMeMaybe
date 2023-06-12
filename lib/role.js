const db = require("./requests");

class Role {
  constructor(db) {
    this.db = db;
  }

  getRoles() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM role`;

      this.db.query(sql, function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  createRole(roleName, roleSalary, roleDepartmentId) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO role (title, salary, department_id) 
          VALUES (?, ?, ?)`;

      this.db.query(sql, [roleName, roleSalary, roleDepartmentId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
          console.table(results);
        }
      });
    });
  }

  deleteRole(roleName) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM role WHERE id = ?`;
  
      this.db.query(sql, roleName, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
          console.table(results);
        }
      });
    });
  }

  editRoleName(roleName, roleId) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE role SET title = ? WHERE id = ?`;
  
      this.db.query(sql, [roleName, roleId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
          console.table(results);
        }
      });
    });
  }

  editRoleSalary(roleSalary, roleId) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE role SET salary = ? WHERE id = ?`;
  
      this.db.query(sql, [roleSalary, roleId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
          console.table(results);
        }
      });
    });
  }

  editRoleDepartment(roleDepartment, roleId) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE role SET department_id = ? WHERE id = ?`;
  
      this.db.query(sql, [roleDepartment, roleId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
          console.table(results);
        }
      });
    });
  }

  returnRolesByDepartment(roleDepartment, roleId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM role WHERE department_id = ?`;
  
      this.db.query(sql, [roleDepartment, roleId], (err, results) => {
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

module.exports = Role;
