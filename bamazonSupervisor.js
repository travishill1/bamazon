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
            viewProducts();
        }
        if (answer.supervisorStart === "CREATE_Department") {
            viewLow();
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







// 2. Create New Department -