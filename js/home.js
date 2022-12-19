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
function setData(week, concentrations, wormCount, userID) {
  // Set the data
  set(ref(db, `users/${userID}/data/${week}/${concentrations}`), {
    ["Worm Count"]: wormCount,
  })
    .then(() => {
      alert("Data saved successfully");
    })
    .catch((error) => {
      alert(`Error: ${error.code} - ${error.message}`);
    });
}

document.getElementById("set").onclick = function () {
  const week = "Week " + document.getElementById("week").value;
  const concentrations = document.getElementById("concentrations").value;
  const wormCount = document.getElementById("wormCount").value;
  const userID = currentUser.uid;

  setData(week, concentrations, wormCount, userID);
};

// -------------------------Update data in database --------------------------
function updateData(week, concentrations, wormCount, userID) {
  // Set the data
  update(ref(db, `users/${userID}/data/${week}/${concentrations}`), {
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

// ----------------------Get a datum from FRD (single data point)---------------

// ---------------------------Get a month's data set --------------------------
// Must be an async function because you need to get all the data from FRD
// before you can process it for a table or graph

async function getDataSet(week, userID) {
  // let weekVal = document.getElementById("setWeek");

  // weekVal.textContent = `Week: ${week}`;

  const concentration = [];
  const wormCount = [];
  const tbodyEl = document.getElementById("tbody-2"); //Select <tbody> from table

  const dbref = ref(db); //firebase parameter required for 'get'

  //wait for all data to be pulled from the frd
  //provide path through the nodes to the data
  await get(child(dbref, `users/${userID}/data/Week ${week}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        // console.log("THE SNAPSHOT" + snapshot.val());
        //get the data from the snapshot
        snapshot.forEach((child) => {
          // console.log("THE SNAPSHOT" + child, child.key, child.val());
          concentration.push(child.key);
          wormCount.push(Object.values(child.val())[0]);
        });
      } else {
        alert("No data found");
      }
    })
    .catch((error) => {
      alert(`Error: ${error}`);
    });

  //Clear table
  tbodyEl.innerHTML = "";
  //Dynamically add table rows to HTML

  for (let i = 0; i < concentration.length; i++) {
    addItemToTable(week, concentration[i], wormCount[i], tbodyEl);
  }
}

// Add a item to the table of data
function addItemToTable(week, concentration, wormCount, tbodyEl) {
  let tr = document.createElement("tr");
  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  let td3 = document.createElement("td");

  td1.innerHTML = week;
  td2.innerHTML = concentration;
  td3.innerHTML = wormCount;

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);

  tbodyEl.appendChild(tr);
}

// -------------------------Delete a day's data from FRD ---------------------

function deleteData(week, concentration, userID) {
  remove(ref(db, `users/${userID}/data/Week ${week}/${concentration}`))
    .then(() => {
      alert("Data deleted successfully");
    })
    .catch((error) => {
      alert(`Error: ${error}`);
    });
}

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

// Get, Set, Update, Delete Sharkriver Temp. Data in FRD
// Set (Insert) data function call

// Update data function call

// Get a datum function call
function getDatum(userID, week, concentration) {
  // Get the data
  let weekVal = document.getElementById("weekVal");
  let concentrationVal = document.getElementById("concentrationVal");
  let wormVal = document.getElementById("wormVal");

  const dbref = ref(db);

  get(child(dbref, `users/${userID}/data/Week ${week}/${concentration}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        weekVal.textContent = week;
        concentrationVal.textContent = concentration;
        wormVal.textContent = Object.values(snapshot.val())[0];
      } else {
        alert("No data available");
      }
    })
    .catch((error) => {
      alert(`Error: ${error.code} - ${error.message}`);
    });
}

//Get a datum
document.getElementById("get").onclick = function () {
  const week = document.getElementById("getWeek").value;
  const concentration = document.getElementById("getConcentrations").value;

  getDatum(currentUser.uid, week, concentration);
};

// Get a data set function call
document.getElementById("getDataSet").onclick = function () {
  const week = document.getElementById("setWeek").value;
  const userID = currentUser.uid;

  getDataSet(week, userID);
};

// Delete a single day's data function call
document.getElementById("delete").onclick = function () {
  const week = document.getElementById("delWeek").value;
  const concentration = document.getElementById("delConcentration").value;
  const userID = currentUser.uid;

  deleteData(week, concentration, userID);
};
