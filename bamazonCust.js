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
  console.log("\n|| WELCOME TO BAMAZON! Your Customer ID is ".cyan + connection.threadId + ". ||\n".cyan);
  choice();
});

function choice() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Make a purchase",
        "exit"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Make a purchase":
          displayInventory();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
}

//function to display inventory from the database
function displayInventory() {
  // console.log("=============================================");
  console.log("\nItems available for sale:\n".warn);
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
      promptCust()
    }
    //connection.end()
  )
};

function promptCust() {
  console.log("=====================||=====================");

  inquirer
    .prompt([{
        name: "id",
        type: "number",
        message: "Please enter the item ID of the product you would like to purchase: ".warn,
        validate: function (val) {
          return !isNaN(val) || "Please enter a valid number.";
        }
      },
      {
        name: "quant",
        type: "number",
        message: "How many units of this product would you like?".warn
      },

    ])
    //check if store has enough of the product to meet the customer's request
    .then(function (answer) {
      //console.log(answer.id);
      connection.query("SELECT * FROM products WHERE ?", {
        item_id: answer.id
      }, function (err, res) {
        // if (err) throw err;
        //console.log(res)
        if (answer.quant > res[0].stock_quantity) {
          console.log("\nINSUFFICIENT QUANTITY!! We have ".debug + res[0].stock_quantity + " " + res[0].product_name + "(s)" + " " + "in stock.\n".info)
          // prevent the order from going through
          displayInventory();
        } else if (answer.quant <= res[0].stock_quantity) {
          //Update the CART if we have enough in stock
          console.log("\n-----------------YOUR CART---------------------\n".error);
          console.log("\nThis item(s): " + res[0].product_name + " has been added to your cart. Your order total is $ ".debug + (res[0].price * answer.quant) + "\n".debug)
          //console.log("\nYou selected ")
          console.log("Thank you for shopping with us!".debug)
          console.log("\n=====================||=====================\n");
          // update stock quantity
          const updateStock = "UPDATE products SET stock_quantity = " + (res[0].stock_quantity - answer.quant) + " WHERE item_id = " + answer.id;

          connection.query(updateStock, function (err, res) {
            if (err) throw err;

          })
          //update product_sales column
          //const updateSales = "UPDATE products SET product_sales = " + (res[0].price * answer.quant)  + " WHERE item_id = " + answer.id;
          const updateSales = "UPDATE products SET product_sales = product_sales + ? WHERE item_id = ?";

          connection.query(updateSales, [res[0].price * answer.quant, answer.id], function (err, res) {

            if (err) throw err;

            displayInventory();

          })
        }
      })
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
});