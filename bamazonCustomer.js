var mysql = require("mysql");
var inquirer = require("inquirer");
var result = [];
require("console.table");
var item = "";
var stock = 0

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
  console.log("\n\rHere is a list of available items: \n\r");
  customerView();
});

// function will show the item id, product name, and price of products in table
function customerView() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      result.push({item_id: res[i].item_id,
        product_name: res[i].product_name,
        // department_name: res[i].department_name,
        price: res[i].price,
        // stock_quantity: res[i].stock_quantity
        });
    }
    // console.log(result);
    console.table(result);
    chooseAnItem();
  });
}

// here is where customer will make item selection
function chooseAnItem() {
  inquirer
    .prompt({
      name: "buyAnItem",
      type: "input",
      message: "Please enter the item_id of the product you would like to purchase or enter 0 to exit: ",
    })

    //switch statement for each instance of potential product selection
    .then(function(answer) {
      choice = answer.buyAnItem;
      // console.log(choice);
      switch (choice) {

        case "1":
          item = "VIOLIN"
          console.log("You have chosen " + item);
          break;

        case "2":
          item = "'THE FIRM'"
          console.log("You have chosen " + item);
          break;

        case "3":
          item = "DOVE SOAP 6PK"
          console.log("You have chosen " + item);
          break;

        case "4":
          item = "CHANEL PURSE"
          console.log("You have chosen " + item);
          break;

        case "5":
          item = "TENNIS RACQUET"
          console.log("You have chosen " + item);
          break;

        case "6":
          item = "GLASS SLIPPERS"
          console.log("You have chosen " + item);
          break;

        case "7":
          item = "SPIRAL NOTEBOOKS"
          console.log("You have chosen " + item);
          break;

        case "8":
          item = "BOTTLED WATER 20PK"
          console.log("You have chosen " + item);
          break;

        case "9":
          item = "STRAWBERRY AIRFRESHENER"
          console.log("You have chosen " + item);
          break;

        case "10":
          item = "CHEERIOS 20oz BOX"
          console.log("You have chosen " + item);
          break;

        case "0":
          console.log("Thanks for visiting Bamazon!");
          connection.end();
          return;
          break;
      }
       amount();
    });
}
function reenterAmount(){
  amount();
}

//function to take customer's desired quantity and determine if there is enough on hand.  Sale is only a success if there is enough stock.
function amount() {
  inquirer
    .prompt({
      name: "enterAmount",
      type: "input",
      message: "Please enter an amount: ",
    })
    .then(function(answer) {
      var amount = answer.enterAmount;
      connection.query("SELECT * FROM products", function(err, res) {
        if (choice === "1") stock = res[0].stock_quantity;
        else if(choice === "2") stock = res[1].stock_quantity;
        else if(choice === "3") stock = res[2].stock_quantity;
        else if(choice === "4") stock = res[3].stock_quantity;
        else if(choice === "5") stock = res[4].stock_quantity;
        else if(choice === "6") stock = res[5].stock_quantity;
        else if(choice === "7") stock = res[6].stock_quantity;
        else if(choice === "8") stock = res[7].stock_quantity;
        else if(choice === "9") stock = res[8].stock_quantity;
        else if(choice === "10") stock = res[9].stock_quantity;

        var total = res[choice - 1].price * amount;
        // console.log(total);
        //giving customer confirmation that order is placed and what their $total is now.
          if (amount <= stock){
            console.log("Your order of " + amount + " " + item + "(s) has been succefully placed.\n" +
                        "Your Total is: $" + total + "\n" + "Thank you for your business!");

                   var query = connection.query(
             "UPDATE products SET ? WHERE ?",[
               {
                 stock_quantity: res[choice - 1].stock_quantity - amount,
               },
               {
                 item_id: res[choice - 1].item_id
               }
             ]
           );

          } else {
            console.log("Sorry we only have " + stock + " available.  PLease enter a different amount.")
            reenterAmount();

           
          }
          	 connection.end();
            return;

      });
    });
}




