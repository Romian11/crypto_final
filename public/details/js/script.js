import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  update,
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

const submitButton = document.getElementById("submit_button");

submitButton.addEventListener("click", (event) => {
  const age = document.getElementById("age");
  const pno = document.getElementById("pno");
  const amount = document.getElementById("amount");
  const name = document.getElementById("name");
  const user = JSON.parse(localStorage.getItem("login_info"));

  var data = {
    email: user.email,
    name: name.value,
    curr_balance: amount.value,
    holding: {
      // homelander:{
      //   curr_price: 0,
      //   avg_price:0,
      //   qty:0
      // }
    },
    starting_bal: amount.value,
    invested: 0,
    pno: pno.value,
    age: age.value,
  };
  event.preventDefault();

  const email = user.email;
  const sanitizedEmail = email.replace(".", "_");
  const referencePath = "users/" + sanitizedEmail;

  const userRef = ref(db, referencePath);

  set(userRef, data)
    .then(() => {
      window.location = "/";
    })
    .catch((error) => {
      console.error("Error inserting data:", error);
    });
});
