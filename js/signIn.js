// ----------------- User Sign-In Page --------------------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
  update,
  child,
  get,
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

// ---------------------- Sign-In User ---------------------------------------//
document.getElementById("signIn").onclick = function () {
  // Get the values from the form
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
      //log sign in date in databse
      //update will only add the last_login
      let logDate = new Date();
      update(ref(db, "users/" + user.uid + "/accountInfo"), {
        last_login: logDate,
      }).then(() => {
        alert("Signed in successfully!");

        //get snapshot of all user info and pass it to the login() function
        get(ref(db, "users/" + user.uid)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            logIn(snapshot.val());
          } else {
            console.log("No data available");
          }
        });
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
};

// ---------------- Keep User Logged In ----------------------------------//
function logIn(user) {
  let keepLoggedIn = document.getElementById("keepLoggedInSwitch").checked;

  if (!keepLoggedIn) {
    sessionStorage.setItem("user", JSON.stringify(user));
    window.location = "../index.html";
  } else {
    localStorage.setItem("keepLoggedIn", "yes");
    localStorage.setItem("user", JSON.stringify(user));
    window.location = "../index.html";
  }
}
