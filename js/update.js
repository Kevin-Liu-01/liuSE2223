// ----------------- Page Loaded After User Sign-in -------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
  update,
  child,
  get,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcnmNZVpBQ5_Dgo69GdNA1hkQo-EsleQI",
  authDomain: "researchdb-a3338.firebaseapp.com",
  databaseURL: "https://researchdb-a3338-default-rtdb.firebaseio.com",
  projectId: "researchdb-a3338",
  storageBucket: "researchdb-a3338.appspot.com",
  messagingSenderId: "531435590676",
  appId: "1:531435590676:web:578a6e4a3af1fcbb390301",
  measurementId: "G-WE9P1GRDJJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize authentication
const auth = getAuth();

//Return instance of app's FRD
const db = getDatabase(app);

// ---------------------// Get reference values -----------------------------
let userLink = document.getElementById("userLink");
let signOutLink = document.getElementById("signOut");
let welcome = document.getElementById("welcome");
let currentUser = null;

// ----------------------- Get User's Name'Name ------------------------------
function getUsername() {
  //grab value for key logged in switch
  let keeptLoggedIn = localStorage.getItem("keepLoggedIn");

  if (keeptLoggedIn == "yes") {
    currentUser = JSON.parse(localStorage.getItem("user"));
  } else {
    currentUser = JSON.parse(sessionStorage.getItem("user"));
  }
  if (currentUser != null) {
    currentUser = currentUser.accountInfo;
  }
}

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function signOutUser() {
  // Clear session and localStorage
  sessionStorage.removeItem("user");
  localStorage.removeItem("user");
  localStorage.removeItem("keepLoggedIn");

  signOut(auth)
    .then(() => alert("Sign out successful"))
    .catch((error) => alert(`Error: ${error.code} - ${error.message}`));
}

// ------------------------Set (insert) data into FRD ------------------------
// function setData(year, month, day, temp, userID) {
//   // Set the data
//   set(ref(db, `users/${userID}/data/${year}/${month}`), {
//     [day]: temp,
//   })
//     .then(() => {
//       alert("Data saved successfully");
//     })
//     .catch((error) => {
//       alert(`Error: ${error.code} - ${error.message}`);
//     });
// }

//COMMENT STARTS HERE
// document.getElementById("set").onclick = function () {
//   const year = document.getElementById("year").value;
//   const month = document.getElementById("month").value;
//   const day = document.getElementById("day").value;
//   const temp = document.getElementById("temperature").value;
//   const userID = currentUser.uid;

//   setData(year, month, day, temp, userID);
// };

// -------------------------Update data in database --------------------------
function updateData(week, concentrations, wormCount, userID) {
  // Set the data
  update(ref(db, `users/${userID}/data/${week}`), {
    ["Concentrations"]: concentrations,
    ["Worm Count"]: wormCount,
  })
    .then(() => {
      alert("Data updated successfully");
    })
    .catch((error) => {
      alert(`Error: ${error.code} - ${error.message}`);
    });
}

document.getElementById("update").onclick = function () {
  const week = "Week " + document.getElementById("week").value;
  const concentrations = document.getElementById("concentrations").value;
  const wormCount = document.getElementById("wormCount").value;
  const userID = currentUser.uid;

  updateData(week, concentrations, wormCount, userID);
};
// COMMENT ENDS HERE

// ----------------------Get a datum from FRD (single data point)---------------

// ---------------------------Get a month's data set --------------------------
// Must be an async function because you need to get all the data from FRD
// before you can process it for a table or graph

// Add a item to the table of data

// -------------------------Delete a day's data from FRD ---------------------

// --------------------------- Home Page Loading -----------------------------

window.onload = function () {
  getUsername();

  if (currentUser == null) {
    userLink.innerText = "Create New Account";
    userLink.classList.replace("nav-link", "btn");
    userLink.classList.add("btn-primary");
    userLink.href = "../pages/register.html";

    signOutLink.innerText = "Sign In";
    signOutLink.classList.replace("nav-link", "btn");
    signOutLink.classList.add("btn-success");
    signOutLink.href = "../pages/signIn.html";
  } else {
    console.log(currentUser);

    userLink.innerText = "Signed in as " + currentUser.firstName;
    welcome.innerText = "Welcome, " + currentUser.firstName;
    userLink.classList.replace("btn", "nav-link");
    userLink.classList.add("btn-primary");
    userLink.href = "#";

    signOutLink.innerText = "Sign Out";
    signOutLink.classList.replace("btn", "nav-link");
    signOutLink.classList.add("btn-success");
    signOutLink.addEventListener("click", (e) => {
      e.preventDefault();
      signOutUser();
      window.location = "../index.html";
    });
  }
};

// ------------------------- Set Welcome Message -------------------------
// Set (Insert) data function call

// Update data function call

// //START COMMENT HERE
// // Get a datum function call
// function getDatum(userID, year, month, day) {
//   // Get the data
//   let yearVal = document.getElementById("yearVal");
//   let monthVal = document.getElementById("monthVal");
//   let dayVal = document.getElementById("dayVal");
//   let tempVal = document.getElementById("tempVal");

//   const dbref = ref(db);

//   get(child(dbref, `users/${userID}/data/${year}/${month}/${day}`))
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         yearVal.textContent = year;
//         monthVal.textContent = month;
//         dayVal.textContent = day;
//         tempVal.textContent = snapshot.val();
//       } else {
//         alert("No data available");
//       }
//     })
//     .catch((error) => {
//       alert(`Error: ${error.code} - ${error.message}`);
//     });
// }

// document.getElementById("get").onclick = function () {
//   const year = document.getElementById("getYear").value;
//   const month = document.getElementById("getMonth").value;
//   const day = document.getElementById("getDay").value;

//   getDatum(currentUser.uid, year, month, day);
// };
//END COMMENT HERE
// Get a data set function call

// Delete a single day's data function call
