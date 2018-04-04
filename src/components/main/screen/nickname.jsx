import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import Error from '../error';
import firebase from 'firebase';

class Nickname extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      nickname: '',
      redirect: false,

      gameid: '',
      userid: '',
      gamesid: '',

      errorStatus: false,
      errorTitle: '',
      errorSubTitle: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount(){
    this.setState({
      gameid: this.props.match.params.id,
      gamesid: this.props.location.state.gamesid
    });
  }

  handleChange(e) {
    this.setState({nickname: e.target.value});
  }

  handleSubmit(e) {
    var self = this;
    if(this.state.nickname != ''){
      console.log(self.state.quizid);
      const newUser = {
        nickname: self.state.nickname
      }
      const pushid = firebase.database().ref().child('games').child(self.state.gamesid).child('users').push(newUser);
      const userid = pushid.key;
      self.setState({
        userid: userid,
        redirect: true
      })
    } else {
      self.setState({
        errorStatus: true,
        errorTitle: 'Helaas mag je nickname niet leeg zijn.',
        errorSubTitle: 'Controleer en probeer het opnieuw.'
      });
    }
    e.preventDefault();
  }

  render() {
    if(this.state.redirect == true){
      return (
        <Redirect push to={{
          pathname: "/play/" + this.state.gameid + "/join",
          state: {
            userid: this.state.userid,
            gamesid: this.state.gamesid
          }
        }}/>
      );
    }

    return (
      <div className="outer play_body">
        <div className="inner">
            <Error key='mainError' status={this.state.errorStatus} title={this.state.errorTitle} subtitle={this.state.errorSubTitle}/>
          <form onSubmit={this.handleSubmit} className="ui form">
            <div className="field">
              <input type="text" name="name" placeholder="Nickname" value={this.state.nickname} onChange={this.handleChange} className="placeholder max" />
            </div>
            <button className="ui button" type="submit">Enter</button>
          </form>
        </div>
      </div>
    );
  }

}
export default Nickname;
