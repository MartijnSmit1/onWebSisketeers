import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import firebase, { auth } from 'firebase';

class Login extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      error: false,

      auth: false
    };

    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount(){
    var self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        self.setState({
          auth: true
        });
      } else {
        self.setState({
          auth: false
        });
      }
    });
  }

  handleChangeEmail(e) {
    this.setState({email: e.target.value});
  }

  handleChangePassword(e) {
    this.setState({password: e.target.value});
  }

  handleSubmit(e) {
    const { email, password } = this.state;
    auth().signInWithEmailAndPassword(email, password).then(() => {
      this.setState({
        email: '',
        password: '',
        error: false,
        auth: true
      });
    }).catch(() => {
      this.passwordInput.focus();
      this.setState({
        password: '',
        error: true
      });
    });
    e.preventDefault();
  }

  handleError(){
    if(this.state.error){
      return (
        <div className="field error">
          <div className="ui left icon input">
            <i className="lock icon"></i>
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChangePassword}
              placeholder="Wachtwoord"
              ref={(input) => { this.passwordInput = input; }}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="field">
          <div className="ui left icon input">
            <i className="lock icon"></i>
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChangePassword}
              placeholder="Wachtwoord"
              ref={(input) => { this.passwordInput = input; }}
            />
          </div>
        </div>
      );
    }
  }

  render() {
    if(this.state.auth == true){
      return <Redirect to='/admin/dashboard' />;
    }

    return (
      <div className="outer play_body">
        <div className="inner max">
          <div className="column">
            <h2 className="ui image header">
              <div className="content">
                Log in op jouw account
              </div>
            </h2>
            <form className="ui large form" onSubmit={this.handleSubmit}>
              <div className="ui segment">
                <div className="field">
                  <div className="ui left icon input">
                    <i className="user icon"></i>
                    <input
                      type="text"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChangeEmail}
                      placeholder="E-mailadres"
                      ref={(input) => { this.emailInput = input; }}
                    />
                  </div>
                </div>
                {this.handleError()}
                <button className="ui fluid large submit button secondary" type="submit">Login</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    );
  }

}
export default Login;
