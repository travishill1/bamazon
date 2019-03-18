var mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "stupid",
    database: "bamazon"
});


// Menu:
// 1.  View Product Sales by Department
// 2.  Create New Department

connection.connect(function(err) {
    if (err) throw err;
    // show all items after the connection is made
    supervisorMenu();
  });


  function supervisorMenu() {
    inquirer
      .prompt({
        name: "supervisorStart",
        type: "list",
        message: "MANAGER: What would you like to do?",
        choices: ["VIEW_Product_Sales", "CREATE_Department"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.supervisorStart === "VIEW_Product_Sales") {
            viewByDepartment();
        }
        if (answer.supervisorStart === "CREATE_Department") {
            createDepartment();
          }
        // else{
        //   connection.end();
        // }
      });
  }

// 1.  View Product Sales by Department - display a summarized table in their terminal/bash window. 
// department_id	department_name	    over_head_costs	    product_sales	total_profit
// 01	            Electronics	        10000	            20000	        10000
// 02	            Clothing	        60000	            100000	        40000

// The total_profit column should be calculated on the fly using the difference between 
// over_head_costs and product_sales. total_profit should not be stored in any database. You should use a custom alias.

function viewByDepartment(){
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





// 2. Create New Department -

function createDepartment(){
    // prompt for info about the item being put up for auction
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
            // re-prompt the user for if they want to bid or post
            managerMenu();
          }
        );
      });
  }