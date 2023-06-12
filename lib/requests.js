const mysql = require('mysql2');
require('dotenv').config();

let db;

const connectDatabase = new Promise((resolve, reject) => {
  db = mysql.createConnection({
    host: 'localhost',
    user:   process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:  process.env.DB_NAME,
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
