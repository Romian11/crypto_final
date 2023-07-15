var z = 0;
const queryString = window.location.search;

const searchParams = new URLSearchParams(queryString);

const coinname = searchParams.get('tvwidgetsymbol');
// const x = window.Location;

const lower_src = coinname.toLowerCase();
let ws1 = new WebSocket(`wss://stream.binance.com:9443/ws/${lower_src}@trade`);
let price = 0;

ws1.onmessage = (event) => {
var data = JSON.parse(event.data);
price = parseFloat(data.p).toFixed(2);
  z  = price
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  update,
  get,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDaP626t5yai5YoLxlM1jGTQZOU9sQRS-I",
  authDomain: "cryptodatabase-212fe.firebaseapp.com",
  projectId: "cryptodatabase-212fe",
  storageBucket: "cryptodatabase-212fe.appspot.com",
  messagingSenderId: "279272856166",
  appId: "1:279272856166:web:ddb8e6b14679355a6b2ba7",
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const buybtn = document.getElementById("buy_btn");
const sellbtn = document.getElementById("sell_btn");


buybtn.addEventListener("click", (event) => {
  event.preventDefault();
  var user = localStorage.getItem("login_info");
 
  if (user == null) {
    alert("Please login first before buying");
  } else {
    const user = JSON.parse(localStorage.getItem("login_info"));
    const email = user.email;
    const sanitizedEmail = email.replace(".", "_");
    const referencePath = "users/" + sanitizedEmail;
    const amount = document.getElementById("amount").value;
    const userRef = ref(db, referencePath);
    
    
    const curr_price = z;

    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const currBalance = userData.curr_balance;
          const invested = parseFloat(userData.invested);
       
         var qty = 0 ;      
         var avg_price = 0;
          const coinHolding = userData.holding?.[coinname];
       
          if(coinHolding===undefined) {
           
           qty = 0;
           
          }
          else{
            qty = parseFloat(coinHolding.qty);
            avg_price = parseFloat(coinHolding.avg_price);
          }
        console.log(currBalance,amount);
          if (amount > currBalance) {
            alert("you dont have enough money in your wallet");
          } else {
            // if (coinHolding == undefined) {
            const  referencePath = "users/" + sanitizedEmail;
             const userRef = ref(db, referencePath);
           
              //  console.log(((qty * avg_price) + amount) / (qty + (amount / curr_price)));
               const newAvgPrice = ((qty * avg_price) + parseFloat(amount)) / (qty + (parseFloat(amount) / curr_price));
              console.log(newAvgPrice);
              update(userRef, {
                [`holding/${x}`]: {
                  curr_price: curr_price,
                  avg_price: newAvgPrice,
                  qty: qty + amount/curr_price
                }
              })
                .then(() => {
                  console.log("New holding added successfully!");
                })
                .catch((error) => {
                  console.error("Error adding new holding:", error);
                });
                
                update(userRef, {
                  curr_balance: currBalance-amount,
                  invested: invested+ parseFloat(amount)
                })
                .then(() => {
                  console.log("New holding added successfully!");
                })
                .catch((error) => {
                  console.error("Error adding new holding:", error);
                });
            }
            
          // }
        } else {
          console.log("User not found");
        }
      })
      .catch((error) => {
        console.log("Error fetching user details:", error);
      });
  }
});




sellbtn.addEventListener("click", (event) => {
  event.preventDefault();
  var user = localStorage.getItem("login_info");
 
  if (user == null) {
    alert("Please login first before selling");
  } else {

    const user = JSON.parse(localStorage.getItem("login_info"));
    const email = user.email;
    const sanitizedEmail = email.replace(".", "_");
    const referencePath = "users/" + sanitizedEmail;
    const amount = document.getElementById("amount").value;
    const userRef = ref(db, referencePath);
    
    const curr_price = z;

    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const currBalance = userData.curr_balance;
          const invested = parseFloat(userData.invested);
         
         var qty = 0 ;      
         var avg_price=0;
          const coinHolding = userData.holding?.[coinname];
       
          if(coinHolding===undefined) {
           
           qty = 0;
           alert("you need to buy first"); 
          }
          else{
            qty = parseFloat(coinHolding.qty);
            avg_price = parseFloat(coinHolding.avg_price);
          }
        
          if (amount > qty) {

            alert("you dont have enough to sell");
          } else {
            // if (coinHolding == undefined) {
            const  referencePath = "users/" + sanitizedEmail;
             const userRef = ref(db, referencePath);
             const newAvgPrice = ((qty * avg_price) - parseFloat(amount)*z) / (qty - (parseFloat(amount) )); 
             console.log(((qty * avg_price) - parseFloat(amount)*z));
                console.log((qty - (parseFloat(amount) )));
              update(userRef, {
                [`holding/${x}`]: {
                  curr_price: curr_price,
                  avg_price: newAvgPrice,
                  qty: qty - amount,
                }
              })
                .then(() => {
                  console.log("New holding added successfully!");
                })
                .catch((error) => {
                  console.error("Error adding new holding:", error);
                });
                
                update(userRef, {
                  curr_balance: currBalance+ z*amount,
                  invested: invested-parseFloat(z*amount)
                })
                .then(() => {
                  console.log("New holding added successfully!");
                })
                .catch((error) => {
                  console.error("Error adding new holding:", error);
                });
            }
            
          // }
        } else {
          console.log("User not found");
        }
      })
      .catch((error) => {
        console.log("Error fetching user details:", error);
      });
  }
});