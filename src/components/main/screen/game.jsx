import React, {Component} from 'react';
import './game.css';


class Game extends React.Component {

  constructor(props){
console.log("HIER");
    super(props);
  }

  componentDidMount(){
    console.log(this.props.match.params.id);
    console.log(this.props.location.state.userid);
  }

  render() {
console.log("HIER komt ie ook");

    return (
      <div>
        <h2>Vraag 1</h2>
          <div id="canvas">

          </div>
      </div>
    );
  }

}
export default Game;
