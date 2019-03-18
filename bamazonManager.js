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
        // else{
        //   connection.end();
        // }
      });
  }

// View Products for Sale - the app should list every available item: the item IDs, names, prices, and quantities.

function viewProducts(){
    connection.query("SELECT * from products", function(err, results) {
        if (err) throw err;
        console.log("Available items:");
        for (let i = 0; i < results.length; i++) {
          console.log(`
          ID: ${results[i].item_id}
          Product name: ${results[i].product_name}
          Price: $${results[i].price}
          Stock Quantity: ${results[i].stock_quantity}`);
        }
        managerMenu();
      });
}

// View Low Inventory - it should list all items with an inventory count lower than five.

function viewLow(){
    connection.query("SELECT * from products WHERE stock_quantity<5", function(err, results) {
        if (err) throw err;
        console.log("Available items:");
        for (let i = 0; i < results.length; i++) {
          console.log(`
          ID: ${results[i].item_id}
          Product name: ${results[i].product_name}
          Price: $${results[i].price}
          Stock Quantity: ${results[i].stock_quantity}`);
        }
        managerMenu();
      });
}

// Add to Inventory - should display a prompt that will let the manager "add more" of any item currently in the store.

function addInventory(){
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        const choices = function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
        }
          inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: choices(),
          filter: function(choice){
              choiceArray = choices();
              return choiceArray.indexOf(choice)+1;
          },
          
          message: "What product would you like to restock?",
          validate: function(value) {
            if (isNaN(value)) {
              return false;
            } else {
              return true;
            }
          }
        },
        {
          name: "howmuch",
          type: "input",
          message: "How much would you like to restock?",
          validate: function(value) {
            if (isNaN(value)) {
              return false;
            } else {
              return true;
            }
          }
        }
      ])
      .then(function(answer) {
        let amountWant = parseInt(answer.howmuch);
        let id = answer.choice;
        console.log(id)
        connection.query(
          "SELECT stock_quantity, price FROM products WHERE item_id = ?",
          id,
          function(err, results) {
            if (err) throw err;
            // let price = results[0].price;
            // console.log(results[0].stock_quantity);

            // check to see if there is enough stock for how much the user wants
              let newAmount = results[0].stock_quantity + amountWant;
            //   let totalPrice = amountWant * price;

              // update db, let the user know, and start over
              updateDB(newAmount, id);
              console.log(`You have added ${amountWant} to the stock for a total of ${newAmount}`);
              managerMenu();
            
      })
  })
      });
};

function updateDB(newAmount, id) {
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: newAmount,
            },
            {
              item_id: id
            }
          ],
          function(err) {
            if (err) throw err;
          }
        );
      }

// Add New Product - it should allow the manager to add a completely new product to the store.

function addNew(){
  // prompt for info about the item being put up for sale
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the name of the product you would like to add?"
      },
      {
        name: "department",
        type: "input",
        message: "What department would you like to place your new product in?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the price per unit?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many units are available for sale (stock)?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new product into the db with that info
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.item,
          department_name: answer.department,
          price: answer.price || 0,
          stock_quantity: answer.quantity || 0
        },
        function(err) {
          if (err) throw err;
          console.log("Your product was added successfully!");
          managerMenu();
        }
      );
    });
}



