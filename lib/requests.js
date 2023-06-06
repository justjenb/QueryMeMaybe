class Request {
  constructor(sql, item) {
    this.sql = sql;
    this.item = item;
  }

  setQuery(sql) {
    this.sql = sql;
    return sql;
  }

  setItem(item) {
    this.item = item;
    return item;
  }

  getDepartments() {
    throw new Error("Child class must implement getDepartments() method.");
  }

  newDepartment() {
    throw new Error("Child class must implement newDepartment() method.");
  }
}

module.exports = Request;