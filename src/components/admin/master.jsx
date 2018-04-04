import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import firebase, { auth } from 'firebase';
import Login from './login';
import Dashboard from './dashboard';
import Quizzen from './quizzen/master';
import Quiz from './quiz/master';
import Games from './games/master';

class Master extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <Route exact path="/admin" component={Login} />
            <Route exact path="/admin/dashboard" component={Dashboard} />
            <Route exact path="/admin/quizzen" component={Quizzen} />
            <Route exact path="/admin/games" component={Games} />
            <Route path="/admin/quizzen/:id" component={Quiz} />
          </div>
        </Router>
      </div>
    );
  }

}
export default Master;
