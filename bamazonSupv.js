require("dotenv").config();
const keys = require("./keys.js");
const mysql = require('mysql');
const colors = require('colors');
const Table = require('cli-table');
const inquirer = require('inquirer');

var password =  keys.mysql.password;

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
 
});

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