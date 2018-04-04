import React, {Component} from 'react';
import Navbar from '../main/navbar';
import { BrowserRouter as Router, Route, Link, Redirect, NavLink } from 'react-router-dom';
import firebase from 'firebase';
import Quiztable from './../quizzen/quiztable';

class Games extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      quizzen: []
    }

    this.renderQuizzen = this.renderQuizzen.bind(this);
  }

  componentDidMount(){
    var self = this;
    const rootRef = firebase.database().ref().child('quizzen');
    rootRef.on('value', snap => {
      self.setState({
        quizzen: snap.val()
      });
    });
  }

  renderQuizzen(currentQuiz, i){
      if (currentQuiz.vragen == undefined) {
          currentQuiz.vragen = {length: 0};
      }
      console.log(currentQuiz);
       return (
           <Quiztable
               key={i}
               quiz={currentQuiz}
               aantal={currentQuiz.vragen.length}
           />
       );
   }

  render() {

    return (
      <div>
        <Navbar />
        <div className="ui container">
          <div className="ui equal four column grid">
            {this.state.quizzen.map(this.renderQuizzen)}
          </div>
        </div>
      </div>
    );
  }

}
export default Games;
