// Required npm packages for this project
var mysql = require('mysql');
var inquirer = require('inquirer');

// Create a mySQl connection via node 
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Krawchuk#3", // provide your own password!
    database: "bamazon",
});

// Connect to the database and create a function that runs the "showProducts()" function which contains all the products organized in a table
connection.connect(function (err) {
    if (err) throw err;
    showProducts();
});

console.log('\n***************************** WELCOME TO OUR MARTIAL ARTS STORE *****************************\n **********************************  OUR CURRENT STOCK IS  *********************************\n');


// Display All of the Items available for sale. 
var showProducts = function () {

    var query = 'SELECT * FROM products';
    connection.query(query, function (err, res) {

        // console.log(`********* response from query to db: ${res}`);

        for (var i = 0; i < res.length; i++) {

            console.log(`Item ID: ${res[i].item_id} || Product: ${res[i].product_name} || Department: ${res[i].department_name} || Price: ${res[i].price} || Stock: ${res[i].stock_quantity}`);
        }
        cart();
    });
};

/*
Use if "inquirer" for the App to ask questions:
    - The first message should ask them the ID of the product they would like to buy   
    - The second message should ask them how many of the product they would like to buy 
*/
var cart = function () {
    inquirer.prompt([{
        name: "ProductID",
        type: "list",
        message: "What is the ID of the product you would like to buy?",
        choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

        // Validation: it checks weather or not the user typed a response

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

        // console.log(`********* User's item ID answer: ${answer.ProductID} and quantity:  ${answer.Quantity} `);  // for testing purposes only

        var query = 'SELECT * FROM products';
        connection.query(query, function (err, res) {

            // console.log(`********* User's item ID answer - after db query: ${answer.ProductID} and quantitiy: ${answer.Quantity}`);  // for testing purposes only

            var prodChosen = answer.ProductID - 1;

            // check if there is enough stock
            if (answer.Quantity <= res[prodChosen].stock_quantity) {

                var totalPurchase = answer.Quantity * res[prodChosen].price;
                var newStock = res[prodChosen].stock_quantity - answer.Quantity;

                console.log(`\n We currently have ${res[prodChosen].stock_quantity} of ${res[prodChosen].product_name}.`);

                console.log(`\n CONGRATULATIONS! Your order of ${answer.Quantity} ${res[prodChosen].product_name} is now being processed... The total price is $${totalPurchase} . Thanks for shopping with us!`);

                console.log(`\n The updated stock of product id #${res[prodChosen].item_id}: ${res[prodChosen].product_name} is ${newStock}.`);

                console.log('\n*********************************** ONEGAISHIMASU ***********************************\n **********************************  OUR CURRENT STOCK IS  *********************************\n');

                // console.log(`************** New stock ${newStock} of product chosen ID ${prodChosen}`); for testing purpose only

                // update db wit new stock
                connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [newStock, answer.ProductID], function (err, res, fields) {
                    if (err) throw err;
                });

            } else {
                console.log("\n Sorry there is not enough of this product in stock. Check stock available now or come back later...\n");
                console.log('\n ***************************** ONEGAISHIMASU *****************************\n');
            }

            showProducts();
        });
    });
};