import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Main from './components/main/master';
import Admin from './components/admin/master';
import * as f from './functions';


// var q =  {
//     "keuzes" : [ {
//         "goed" : true,
//         "text" : "A"
//     }, {
//         "goed" : false,
//         "text" : "B"
//     }, {
//         "goed" : false,
//         "text" : "C"
//     }, {
//         "goed" : false,
//         "text" : "D"
//     } ],
//     "score" : 10,
//     "time" : 60,
//     "type" : "meerkeuze",
//     "vraag" : "De vraag?"
// }


class App extends React.Component {

    render() {
        return (
            <div className="app">
              <Router>
                <Switch>
                  <Route path="/play" component={Main} />
                  <Route path="/admin" component={Admin} />
                  <Route exact={true} path="/" render={() => {
                      return(<Redirect to="/play" />);
                  }} />
                  <Route path="*" render={() => {
                      return(<Redirect to="/play" />);
                  }} />
                </Switch>
              </Router>
            </div>
        );
    }

}
export default App;
