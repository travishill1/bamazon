var mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("table");

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
    //run supervisor menu prompt after connection is made
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

// NEED GROUP BY
// NEED JOIN
function viewByDepartment(){
    connection.query(
        `
        SELECT departments.department_id, departments.department_name, departments.over_head_costs, 
        SUM(products.product_sales) AS department_sales, (SUM(products.product_sales) - departments.over_head_costs) 
        AS total_profit FROM departments LEFT JOIN products ON products.department_name = departments.department_name 
        GROUP BY departments.department_id 
        ORDER BY departments.department_id ASC
        `, function(err,response){
            if (err) throw err;
        let stats = [['Department_ID','Department_Name', 'Department_Over_Head_Costs', 'Product_Sales', 'Total_Profit']]
        
        for(let i = 0; i < response.length; i++){
            stats.push([
                response[i].department_id, 
                response[i].department_name, 
                response[i].over_head_costs, 
                response[i].department_sales, 
                response[i].total_profit
            ])
        }
        //  console.log(total_profit);
        
        // TABLE
        // let tableresults = New table(stats);
         let tableresults = table.table(stats);
         console.log(tableresults);
        
        supervisorMenu();
    });
  }

// 2. Create New Department -

function createDepartment(){
    // prompt for info about the item being put up for auction
    inquirer
      .prompt([
        {
          name: "departmentadd",
          type: "input",
          message: "What is the name of the department you would like to add?"
        },
        {
          name: "overheadcosts",
          type: "input",
          message: "What is the overhead cost of the department?",
          validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              return false;
            }
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new department into the db with that info
        connection.query(
          "INSERT INTO departments SET ?",
          {
            department_name: answer.departmentadd,
            over_head_costs: answer.overheadcosts,
          },
          function(err) {
            if (err) throw err;
            console.log("Your department was added successfully!");
            // re-prompt the user for if they want to bid or post
            supervisorMenu();
          }
        );
      });
  }