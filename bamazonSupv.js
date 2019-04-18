require("dotenv").config();
const keys = require("./keys.js");
const mysql = require('mysql');
const colors = require('colors');
const Table = require('cli-table');
const inquirer = require('inquirer');

var password = keys.mysql.password;

// mysql connection 
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  //credentials
  user: 'trilogy',
  password: password,
  database: 'bamazon'
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  console.log("\n====== BAMAZON : SUPERVISOR DASHBOARD ======\n".warn);
  displayMenu();
});

function displayMenu() {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "\nPlease select an option: \n".cyan,
      choices: [
        "VIEW PRODUCT SALES BY DEPARTMENT",
        "CREATE NEW DEPARTMENT"
      ]
    })
    .then(function (answer) {

      switch (answer.menu) {
        case "VIEW PRODUCT SALES BY DEPARTMENT":
          viewProd();
          break;

        case "CREATE NEW DEPARTMENT":
          createNewDept();
          break;
      }
    });
}
//function to view products
function viewProd() {

  console.log("=============================================");
  console.log("\nPRODUCT SALES BY DEPARTMENT:\n".warn);

  var query = "SELECT dept.department_id, dept.department_name, dept.over_head_costs, products.product_sales FROM departments AS dept INNER JOIN products ON (dept.department_name = products.department_name) GROUP BY dept.department_name";

  connection.query(query, function (err, res) {
    //if (err) throw err;
    //console.log(res.length + " matches found!");

    // style table headings and loop through inventory
    var displayTable = new Table({
      head: ["DEPARTMENT ID", "DEPARTMENT NAME", "OVERHEAD COSTS ($)", "PRODUCT SALES ($)"],
      colWidths: [22, 22, 22, 22]
    });

    for (var i = 0; i < res.length; i++) {
      displayTable.push(
        [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales]
      );
    }
    console.log(displayTable.toString().info);

    displayMenu();
  })
};

function createNewDept() {
  inquirer.prompt([{
      name: "departmentName",
      type: "input",
      message: "Enter the name of the new department:"
    },
    {
      name: "overHeadCosts",
      type: "input",
      message: "Enter the overhead costs of the new department:"
    }
  ]).then(function (answer) {
    connection.query(
      "INSERT INTO departments SET ?", {
        department_name: answer.departmentName,
        over_head_costs: answer.overHeadCosts
      },
      function (err) {
        if (err) throw err;
        console.log("\nNew Department and Over head costs Successfully added\n");
        displayMenu();
      }
    );
  });
}



colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});