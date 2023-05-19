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
      <div className="join">
        <table>
          <tbody>
            <tr>
              <td>
                <button
                  className="deact-button"
                  onClick={this.removeJoin}
                  key={this.props.index}
                ></button>
              </td>
              <td> {this.props.condition}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Join;
