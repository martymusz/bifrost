import React, { Component } from "react";

class Join extends Component {
  removeJoin = () => {
    this.props.removeJoin(this.props.condition, this.props.index);
  };

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-1 p-0 m-0">
              <button
                className="deact-button"
                onClick={this.removeJoin}
                key={this.props.index}
              ></button>
            </div>
            <div className="col-6 p-0 m-0">
              {this.props.condition.replace("_", ".")}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Join;
