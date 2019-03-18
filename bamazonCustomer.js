
var mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "stupid",
    database: "bamazon"
});


// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.


connection.connect(function(err) {
    if (err) throw err;
    // show all items after the connection is made
    displayAll();
  });


  // query the database for all items being sold and display to user
  function displayAll() {
    connection.query("SELECT * from products", function(err, results) {
      if (err) throw err;
      console.log("Available items:");
      for (let i = 0; i < results.length; i++) {
        console.log(`
        ID: ${results[i].item_id}
        Product name: ${results[i].product_name}
        Price: $${results[i].price}`);
      }
    //   now run the prompts for the user
      start();
    });
  }

  function start() {

    connection.query("SELECT * from products", function(err, results) {
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
          
          message: "What product would you like to buy?",
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
          message: "How much would you like to buy?",
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
        console.log(amountWant);
        let id = answer.choice;
        console.log(id)
        connection.query(
          "SELECT stock_quantity, price, product_sales FROM products WHERE item_id = ?",
          id,
          function(err, results) {
            if (err) throw err;
            let price = results[0].price;
            // console.log(results[0].stock_quantity);

            // check to see if there is enough stock for how much the user wants
            if (results[0].stock_quantity > amountWant) {
              let newAmount = results[0].stock_quantity - amountWant;
              let totalPrice = amountWant * price;
              console.log(results[0].product_sales);
              let productSales = parseFloat(results[0].product_sales);

              console.log(newAmount);
              console.log(totalPrice);
              console.log(productSales);
              console.log(id);

              // there was enough stock, so update db, let the user know, and start over
              updateDB(newAmount, totalPrice, productSales, id);
              console.log(`You have purchased ${amountWant} products for a total of $${totalPrice}`);
              displayAll();
              start();
            }
    
        else {
          // not enough stock available, so apologize and start over
          console.log("We don't have enough stock to meet your requirements. Try again...");
          start();
        }
      })
  })
})
  };
  

  function updateDB(newAmount, totalPrice, productSales, id) {
    let finalProductSales = productSales + totalPrice;
    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: newAmount,
          product_sales: finalProductSales
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