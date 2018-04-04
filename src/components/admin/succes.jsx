import React, {Component} from 'react';


class Succes extends React.Component {

  constructor(props) {
    super(props);
  }



  render() {
    if(this.props.status == true){
      return (
        <div className="ui floating success message">
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
export default Succes;
