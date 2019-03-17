var mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "stupid",
    database: "bamazon"
});

// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product

// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.

// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.

// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.

// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

connection.connect(function(err) {
    if (err) throw err;
    // show all items after the connection is made
    managerMenu();
  });


  function managerMenu() {
    inquirer
      .prompt({
        name: "managerStart",
        type: "list",
        message: "MANAGER: What would you like to do?",
        choices: ["VIEW_Products", "VIEW_Low", "ADD_Inventory", "ADD_New"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.managerStart === "VIEW_Products") {
            viewProducts();
        }
        if (answer.managerStart === "VIEW_Low") {
            viewLow();
          }
        if (answer.managerStart === "ADD_Inventory") {
            addInventory();
          }
        if (answer.managerStart === "ADD_New") {
            addNew();
          }
        else{
          connection.end();
        }
      });
  }
