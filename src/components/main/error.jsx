import React, {Component} from 'react';


class Error extends React.Component {

  constructor(props) {
    super(props);
  }



  render() {
    if(this.props.status == true){
      return (
        <div className="ui floating negative message">
          <div className="header">
            {this.props.title}
          </div>
          <p>{this.props.subtitle}</p>
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }

}
export default Error;
