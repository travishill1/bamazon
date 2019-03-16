
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
    if(err) throw err;
    console.log("connected as id " + connection.threadId);
    // connection.end();
})

inquirer.prompt([
    {
        type: "list",
        name: "postbid",
        message: "Hi there, would you like to ",
        choices: ["Post an Item","Bid on an Item"]
    }
]).then(function(answers){
    if (answers.postbid === "Post an Item") {
            inquirer.prompt([
                {
                    type: "input",
                    name: "postproduct",
                    message: "What is the name of the item you would like to bid?",
                }, {
                    type: "input",
                    name: "postbid",
                    message: "How much would you like to set the starting bid at?"
                }
            ]).then(function(postProduct){
                // console.log(postProduct.postproduct);
            createProduct(postProduct.postproduct, postProduct.postbid);
            readProducts();
            // connection.end();
        })
    }
    if (answers.postbid === "Bid on an Item") {
        console.log("Select the item you want to bid on");
        readProducts();
        inquirer.prompt([
            {
            type: "input",
            name: "pickitem",
            message: "Type the ID of the product you want to bid on ",
            }, 
        ]).then(function(choice){
            console.log(pickitem)
            let userSelect = choice.pickitem;
            connection.query("select bid where id = ?",
            userSelect, 
            function(err, results){
                if(err) throw err;
                let currentbid = results[0].bid;
            inquirer.prompt([
            {
            type: "input",
            name: "placebid",
            message: "How much would you like to bid on the item?",
            validate: function(value){
                if(currentbid > value){
                    console.log("You must bid higher than" + currentbid)
                    return false
                } else if(currentbid < value){
                    return true
                }
                }
            }
            ])
            }
        )}
            )};

function readProducts(){
    connection.query("select * from items", function(err, results) {
        if (err) throw err;
        console.log(results);
        // connection.end();
    })
}

