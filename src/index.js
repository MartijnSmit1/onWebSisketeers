import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyDMwEGhPJi-ts66ddGWTqJAN9EFIAKmAso",
  authDomain: "sisketeers-15556.firebaseapp.com",
  databaseURL: "https://sisketeers-15556.firebaseio.com",
  projectId: "sisketeers-15556",
  storageBucket: "sisketeers-15556.appspot.com",
  messagingSenderId: "470740166069"
};

firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

// test to retrieve data from database

  var database = firebase.database();

  // make the path to the database table
  var testRef = database.ref('quizzen');

  // get data from database
  // parameter 1: get the value
  // parameter 2: what to do when succesful
  // parameter 3: what to do when not succesful
  testRef.on('value', gotData, errData);

  // function for what to do when succesful
  function gotData(data){
  console.log(data.val());
  }
  // function for what to do when succesful
  function errData(err)
  {
  console.log('error!');
  console.log(err);
  }