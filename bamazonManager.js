var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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


function start() {
  inquirer.prompt({
    name: "menu",
    type: "list",
    message: "Select from below: ",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
  })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.menu === "View Products for Sale") {
        viewSale();
      } else if (answer.menu === "View Low Inventory") {
        viewLow();
      } else if (answer.menu === "Add to Inventory") {
        addInv();
      } else if (answer.menu === "Add New Product") {
        newProduct();
      } else {
        connection.end();
      }
    });
}


function newProduct() {
  // prompt for info about the item being put up for auction
  inquirer.prompt([
    {
      name: "item",
      type: "input",
      message: "What is the product you would like to add?"
    },
    {
      name: "department",
      type: "input",
      message: "I which department would you like to add your product?"
    },
    {
      name: "quantity",
      type: "number",
      message: "What is the quantity?!",
    },
    {
      name: "price",
      type: "number",
      message: "what's the price you like to post it for?!"
    }
  ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.item,
          department_name: answer.department,
          price: answer.price || 0,
          stock_quantity: answer.quantity || 0
        },
        function (err) {
          if (err) throw err;
          console.log("Your product was created successfully added!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}



function viewSale() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    var table = new Table({
      head: ['Item ID', 'Product Name', 'Category', 'Price', 'Quantity'],
      colWidths: [10, 15, 15, 10, 10]
    });
    for (i = 0; i < res.length; i++) {
      table.push(
        [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
      );
    }


    console.log(table.toString());
    start();
    // once you have the items, prompt the user for which they'd like to bid on
    // inquirer.prompt([
    //     {
    //       name: "items",
    //       type: "rawlist",
    //       choices: function() {
    //         var choiceArray = [];
    //         for (var i = 0; i < results.length; i++) {
    //             var line = "Product: " + results[i].product_name +  "   " + "Price: $"+ results[i].price + "   " + "Department: "+results[i].department_name;
    //           choiceArray.push(line);
    //         }
    //         return choiceArray;
    //       },
    //       message: "Sales list: "
    //     }
    //   ])
    //   .then(function(answer) {
    //     // get the information of the chosen item
    //    start();
    //   });
  });
}

function viewLow() {
  connection.query("SELECT * FROM products Where stock_quantity < 10 ", function (err, results) {

    if (err) throw err;

    inquirer.prompt([
      {
        name: "items",
        type: "rawlist",
        choices: function () {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            var line = "Product: " + results[i].product_name + "   " + "Quantity: " + results[i].stock_quantity + "   " + "Department: " + results[i].department_name;
            choiceArray.push(line);
          }
          return choiceArray;
        },
        message: "Low Inventory list:(less than 10 items left)"
      }
    ])
      .then(function (answer) {
        console.log("")
        start();
      });
  });
}


function addInv() {

  connection.query("SELECT * FROM products", function (err, results) {


    inquirer.prompt([
      {
        name: "edit",
        type: "rawlist",
        message: "which inventory you want to edit?",
        choices: function () {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            var line = "Product: " + results[i].product_name + "    " + "Quantity: " + results[i].stock_quantity + "    " + "Department: " + results[i].department_name;
            choiceArray.push(line);
          }
          return choiceArray;
        },
      },
      {
        name: "quantity",
        type: "input",
        message: "How much are you adding to stock"
      }
    ])
      .then(function (answer) {
        var chosenItem;
        // var chosenItemQuantity;
        for (var i = 0; i < results.length; i++) {
          var line = "Product: " + results[i].product_name + "    " + "Quantity: " + results[i].stock_quantity + "    " + "Department: " + results[i].department_name;
          if (line === answer.edit) {
            chosenItem = results[i];
            // chosenItemQuantity =results[i].stock_quantity;


          }
        }

  
        var newQuantity = chosenItem.stock_quantity + parseInt(answer.quantity)
        
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
            console.log("Inventory added successfully!");
            start();
          }
        );
      });
  })
};




