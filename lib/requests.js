const mysql = require('mysql2');

let db;

const connectDatabase = new Promise((resolve, reject) => {
  db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password1234',
    database: 'company_db',
  });

  db.connect((err) => {
    if (err) {
      reject(err);
    } else {
      resolve(db);
    }
  });
});

const closeConnection = () => {
  db.end();
};

module.exports = {
  connectDatabase,
  closeConnection
};
