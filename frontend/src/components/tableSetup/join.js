import React, { Component } from "react";

class Join extends Component {
  constructor(props) {
    super(props);

    this.removeJoin = this.removeJoin.bind(this);
  }

  removeJoin = () => {
    this.props.removeJoin(this.props.condition, this.props.index);
  };

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row align-items-center">
            <div className="col p-0 m-0">
              <button
                className="deact-button"
                onClick={this.removeJoin}
                key={this.props.index}
              ></button>
            </div>
            <div className="col p-0 m-0">{this.props.condition}</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Join;
