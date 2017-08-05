var mysql = require("mysql");
var inquirer = require("inquirer");
var result = [];
var idContainer = [];
require("console.table");
var item = "";
var stock = 0;
var choice = "";
var amount = "";
var itemIndex = "";



var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// Your Username
	user: "root", 

	// Your Password
	password: "",
	database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
  // console.log("\n\rHere is a list of available items: \n\r");
  managerOptions();
});


function managerOptions() {
inquirer.prompt([
	
	{
		type: "list",
		name: "options",
		message: "Please use arrows to make selection from choice below: ",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
	}, 
]).then(function(answer){

	switch(answer.options) {
        case "View Products for Sale":
        //this will clear the array
        result = [];
        viewProductsForSale();
        break;

        case "View Low Inventory":
        result = [];
        viewLowInventory();
        break;

        case "Add to Inventory":
        result = [];
        displayInventory();
        break;

        case "Add New Product":
        addNewProduct();
        return;
        break;

        case "Exit":
        console.log("See you next time!");
        connection.end();
        return;
        break;
    }
  });
}


function viewProductsForSale(){
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      result.push({item_id: res[i].item_id,
        product_name: res[i].product_name,
        department_name: res[i].department_name,
        price: res[i].price,
        stock_quantity: res[i].stock_quantity
        });
    }
    console.table(result);
    managerOptions();
  })
}

function viewLowInventory(){
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity < 5) {
        result.push({item_id: res[i].item_id,
        product_name: res[i].product_name,
        department_name: res[i].department_name,
        price: res[i].price,
        stock_quantity: res[i].stock_quantity
        });
      }
    }
    if (result.length) {
      console.table(result);
    }else {
      console.log("No items less than quantity of 5 at this time.");
    }
    managerOptions();
	})
}

//this function will display the inventory to manager first before they add product.
function displayInventory(){
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      result.push({item_id: res[i].item_id,
        product_name: res[i].product_name,
        department_name: res[i].department_name,
        price: res[i].price,
        stock_quantity: res[i].stock_quantity
        });
    }
    console.table(result);
    addToInventory();
  })
}
function addToInventory(){
  inquirer
    .prompt({
      name: "addToInventory",
      type: "input",
      message: "Please enter the item_id for product that you would like to increase inventory: ",
    })

    //switch statement for each instance of potential product selection
    .then(function(answer) {
      choice = answer.addToInventory;
      connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          idContainer.push(res[i].item_id)
        }

        //because "choice" is a string, we have to convert selection to a number
        itemIndex = idContainer.indexOf(Number (choice));
        if (itemIndex != -1) {
          console.log("You have chosen " + res[itemIndex].product_name)
          enterAmount();
        }
      })
    })
}

function enterAmount() {
  inquirer
    .prompt({
      name: "enterAmount",
      type: "input",
      message: "Please enter an amount: ",
    })
    .then(function(input) {
      amount = input.enterAmount
      connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        connection.query("UPDATE products SET ? WHERE ?",[
               {
                 stock_quantity: res[itemIndex].stock_quantity + Number(amount),
               },
               {
                 product_name: res[itemIndex].product_name
               }
              ],
              function(err, res) {
                console.log(res.affectedRows + " product inserted!\n");
                managerOptions();
              } 
        );
        
      })
      
    })

}


function addNewProduct(){

    inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "Please enter product name..."
      }, {
        name: "department",
        type: "input",
        message: "Please enter department name..."
      }, {
        name: "price",
        type: "input",
        message: "Please enter product price per unit..."
      }, {
        name: "quantity",
        type: "input",
        message: "Please enter beginning inventory amount..."
      }
   ]).then(function(input) {
      console.log("Inserting a new product...\n");
        query = connection.query(
          "INSERT INTO products SET ?",[
            {
              product_name: input.name,
              department_name: input.department,
              price: input.price,
              stock_quantity: input.quantity,
            }
          ],
          function(err, res) {
            console.log(res.affectedRows + " product inserted!\n");
            
            managerOptions();
          }
      );     
    })
   
  }
