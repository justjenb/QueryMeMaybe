const Requests = require("./requests.js");

class Department extends Requests {
  constructor(sql, item) {
    super(sql, item);
  }
  getDepartments() {
    return db.query("SELECT * FROM department", function (err, results) {
      console.log(results);
    });
  }
  newDepartment() {
    const sql = `INSERT INTO department (item) 
    Values (?)`;
    const item = req.body.dept_name;

    db.query(sql, item, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: body,
      });
    });
  }
}

module.exports = Department;