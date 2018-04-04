import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import Navbar from './main/navbar';
import firebase from 'firebase';

class Dashboard extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      quizcount: 0
    }
  }

  componentDidMount(){
    var self = this;
    const rootRef = firebase.database().ref().child('quizzen');
    rootRef.on('value', snap => {
      this.setState({
        quizcount: snap.numChildren()
      });
    });
  }

  render() {

    return (
      <div>
        <Navbar />
        <div className="ui container">
          <div className="ui equal width grid statistics">
            <div className="column">
              <div className="ui segment">
                <div className="statistic">
                  <div className="value">
                    {this.state.quizcount}
                  </div>
                  <div className="label">
                    Quizzen
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="ui segment">
                <div className="statistic">
                  <div className="value">
                    -
                  </div>
                  <div className="label">
                    Spelers totaal
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="ui segment">
                <div className="statistic">
                  <div className="value">
                    -
                  </div>
                  <div className="label">
                    Actieve games
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="ui segment">
                <div className="statistic">
                  <div className="value">
                    -
                  </div>
                  <div className="label">
                    Totale antwoorden
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="ui equal width grid">
            <div className="six wide column">
              <div className="ui segment">

              </div>
            </div>
            <div className="column">
              <div className="ui segment">

              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  }

}
export default Dashboard;
