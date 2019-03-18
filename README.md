# bamazon
<p>
Bamazon is an Amazon-like storefront using MySQL.
<br>
<br>
This repo has three different applications which all use a single database:
<br>
<br>
<strong>bamazonCustomer</strong> - Takes in orders from customers and depletes stock from the store's inventory.  <br>
Running this application will first display all of the items available for sale.  The app then prompts users with two messages.
<br>
The first asks them the ID of the product they would like to buy.
<br>
The second asks how many units of the product they would like to buy.
<br>
<br>
<strong>bamazonManager</strong> - Running this application will allow the user to pick between four options: <br>
1) View Products for Sale - logs in the console all the products currently up for sale. <br>
2) View Low Inventory - logs in the console all the products that have less than 5 units left. <br>
3) Add to Inventory - allows the user to add units to an existing product stock. <br>
4) Add New Product - allows the user to create a new product in the database. <br>
<br>
<strong>bamazonSupervisor</strong> - Running this application will allow the user to pick between two options: <br>
1) View Product Sales by Department - logs in the console a table that joins the data from the products table and departments table.  This table shows the overhead costs, product sales, and total profits of each department. <br>
2) Create New Department - allows the user to create a new department with a specified overhead cost.  <br>
<br>
<br>
<strong>Technologies Used:</strong> <br>
<a href="https://www.npmjs.com/package/mysql">MySQL</a> <br>
<a href="https://www.npmjs.com/package/inquirer">Inquirer</a> <br>
<br>

</p>