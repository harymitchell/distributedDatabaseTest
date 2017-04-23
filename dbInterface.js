var simpleSqlParser = require('simple-sql-parser');
var ast = simpleSqlParser.sql2ast('SELECT * from employees join employeeterritories on employeeterritories.employeeid = employees.employeeid');
console.log(JSON.stringify(ast));