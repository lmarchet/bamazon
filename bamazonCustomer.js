// Required npm packages for this project
var mysql = require('mysql');
var inquirer = require('inquirer');

// Create a mySQl connection via node using server and database credentials created in mySQL workbench
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Krawchuk#3",
    database: "bamazon",
});


// Connect to the database and create a function that runs the "showProducts()" function which contains all the products organized in a table
connection.connect(function (err) {
    if (err) throw err;
    showProducts();
})

// Display All of the Items available for sale. 
var showProducts = function () {

    var query = 'SELECT * FROM products';
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Stock: " + res[i].stock_quantity);
        }
        shoppingCart();
    })
};

/*
App should prompt 2 messages:
    - The first message should ask them the ID of the product they would like to buy   
    - The second message should ask them how many of the product they would like to buy 
*/
var shoppingCart = function () {
    inquirer.prompt([{
        name: "ProductID",
        type: "input",
        message: "What is the ID of the product you would like to buy?",

        // Validattion; it checks weather or not the user typed a response
        validate: function (value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        name: "Quantity",
        type: "input",
        message: "How many would you like to buy?",
        validate: function (value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function (answer) {

        /*
        After customer has placed the order, the app should:
        - Check if your store has enough quantity of the product requested
        -  If not, app should respond to the user by saying: "Insufficient quantity" and prevent the order from going through.
        - If bamazon store has enough of the product, the app should fulfill order.
        - App should show the total price of puchase. Then update the SQL database to reflect the remaining quantity. 
        */

        console.log(`user's quantity answer: ${answer.Quantity}`);

        var query = 'SELECT * FROM products WHERE item_id=' + answer.Quantity;
        connection.query(query, function (err, res) {
            if (answer.Quantity <= res) {
                for (var i = 0; i < res.length; i++) {
                    console.log("We currently have " + res[i].stock_quantity + " " + res[i].product_name + ".");
                    console.log("Thank you for your patronage! Your order of " + res[i].stock_quantity + " " + res[i].product_name + " is now being processed.");
                }
            } else {
                console.log("Not enough of this product in stock.");
            }
            showProducts();
        });
    });
};