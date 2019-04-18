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
  console.log("\n====== BAMAZON : MANAGER DASHBOARD ======\n".warn);
  displayMenu();
});

function displayMenu() {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "\nPlease select an option to manage the current inventory: \n".cyan,
      choices: [
        "VIEW PRODUCTS FOR SALE",
        "VIEW LOW INVENTORY",
        "ADD TO INVENTORY",
        "ADD NEW PRODUCT"
      ]
    })
    .then(function (answer) {

      switch (answer.menu) {
        case "VIEW PRODUCTS FOR SALE":
          viewProd();
          break;

        case "VIEW LOW INVENTORY":
          return viewLowInv();


        case "ADD TO INVENTORY":
          addInv();
          break;

        case "ADD NEW PRODUCT":
          addProd();
          break;

      }
    });
}
//function to view products
function viewProd() {

  console.log("=============================================");
  console.log("\nThese Items are available for sale:\n".warn);
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // style table headings and loop through inventory
    var displayTable = new Table({
      head: ["Item ID", "Product Name", "Department Name", "Price ($)", "Stock Quantity"],
      colWidths: [15, 30, 30, 15, 30]
    });
    for (var i = 0; i < res.length; i++) {
      displayTable.push(
        [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
      );
    }
    console.log(displayTable.toString().info);
    displayMenu();
  })
};

//function to view inventory
function viewLowInv() {
  console.log("=============================================");
  console.log("\nLow Inventory:\n".warn);
  connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
    if (err) throw err;
    // style table headings and loop through inventory
    var displayTable = new Table({
      head: ["Item ID", "Product Name", "Department Name", "Price ($)", "Stock Quantity"],
      colWidths: [15, 30, 30, 15, 30]
    });
    for (var i = 0; i < res.length; i++) {
      displayTable.push(
        [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
      );
    }
    console.log(displayTable.toString().info);
    displayMenu();
  })
};
// function to add to the inventory
function addInv() {
  console.log("=====================||=====================");
  inquirer
    .prompt([{
        name: "id",
        type: "number",
        message: "Please enter the item ID of the product you would like to update:"
      },

      {
        name: "quant",
        type: "number",
        message: "How many inventory units would you like to add?"

      },
    ])
    .then(function (answer) {
      var prodId = answer.id
      var newQuant = answer.quant

      connection.query("SELECT * FROM Products WHERE ?", {
        item_id: prodId
      }, function (err, res) {

        //const newQuant = res[0].stock_quantity;

        var update = "UPDATE products SET ? WHERE ?";
        connection.query(update, [{
            stock_quantity: parseInt(res[0].stock_quantity) + parseInt(newQuant)
          },
          {
            item_id: prodId
          }
        ], );
        console.log("\n**************MANAGER INVENTORY UPDATE****************\n".error)
        console.log("Inventory successfully updated!".info)
        viewProd();
      })
    });
};

//function to add new product(s) to the inventory
function addProd() {
  console.log("=====================||=====================");
  inquirer
    .prompt([{
        name: "prodName",
        type: "input",
        message: "Enter the name of the product you would like to add:"
      },

      {
        name: "deptName",
        type: "input",
        message: "Enter the department name of the product you would like to add:"

      },
      {
        name: "price",
        type: "number",
        message: "Enter the price of the product you would like to add:"

      },
      {
        name: "stockQuant",
        type: "number",
        message: "Enter the units of the product you would like to add:"

      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO products SET ?", {
          product_name: answer.prodName,
          department_name: answer.deptName,
          price: answer.price,
          stock_quantity: answer.stockQuant
        },

      )
      console.log("\n**************MANAGER INVENTORY UPDATE****************\n".error)
      console.log("Product successfully updated!".info)
      viewProd();
    })

};

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
})