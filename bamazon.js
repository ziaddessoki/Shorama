var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user

    start();
});

// function which prompts the user for what action they should take


function start() {
    console.log("\r\n");
    console.log("#######---Welcome to Bamazon!!---#######");
    console.log("\r\n");
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "items",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            var line = "Product: " + results[i].product_name +  "   " + "Price: $"+ results[i].price + "   " + "Department: "+results[i].department_name;
                            choiceArray.push(line);

                        }
                        return choiceArray;
                    },
                    message: "Check our best seller list!!"
                },
                {
                    name: "quantity",
                    type: "number",
                    message: "How many would you like to buy of it?"
                }
            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    var line = "Product: " + results[i].product_name +  "   " + "Price: $"+ results[i].price + "   " + "Department: "+results[i].department_name;
                    if (line === answer.items) {
                        chosenItem = results[i];
                    }
                }
                console.log("#########")



                if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
                    var newQuantity = chosenItem.stock_quantity - parseInt(answer.quantity)
                    console.log("Only "+newQuantity+" items left");
                   connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                
                                stock_quantity: newQuantity
                            },
                            {
                                id: chosenItem.id
                            }
                        ],
                        function (error) {
                            if (error) throw err;

                            console.log("you're all set!");
                            var total = chosenItem.price * parseInt(answer.quantity);
                            console.log("you're total will be: $" + total);
                            // update DB 
                            start();
                        }
                    );
                }
                else {
                   
                    console.log("Insufficient quantity!");
                    start();
                }
              
            });
    });
}


