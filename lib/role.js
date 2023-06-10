const db = require("./requests");

class Role {
  constructor(db) {
    this.db = db;
  }

  getRoles() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM roles`;

      this.db.query(sql, function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  createRole(roleName) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO roles (role_name) 
          VALUES (?)`;

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

  deleteRole(roleName) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM roles WHERE role_name = ?`;
  
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

  editRole(roleName) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM roles WHERE role_name = ?`;
  
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

}

module.exports = Role;
