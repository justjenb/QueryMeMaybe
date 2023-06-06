const inquirer = require("inquirer");
const department = require("./department");
const role = require("./role");
const employee = require("./employee");

const mysql = require('mysql2');
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password1234',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

class CLI {
  constructor() {
    this.answers = [];
  }
  run() {
    return inquirer
      .prompt([
        
      ])
      .then((answers) => {

      })
      .catch((err) => {
        console.log(err);
        console.log("Oops. Something went wrong.");
      });
  }
}

module.exports = CLI;
