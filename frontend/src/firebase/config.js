import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyAUA0mYx_ssyZ7hQCYdNLb1aaijKr_E55U",
    authDomain: "testcart-5e159.firebaseapp.com",
    projectId: "testcart-5e159",
    storageBucket: "testcart-5e159.appspot.com",
    messagingSenderId: "542601087098",
    appId: "1:542601087098:web:bd5613d6f0cf9feaba53c3",
    measurementId: "G-LHS1E09VW5"
  };


  const app = initializeApp(firebaseConfig);
  export default  getStorage(app);
  
