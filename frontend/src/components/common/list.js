import React, { Component } from "react";

class List extends Component {
  render() {
    return (
      <div>
        <ul>
          {this.props.data.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default List;
