import React, { Component } from "react";
import { Alert } from "react-bootstrap";

class CustomAlert extends Component {
  render() {
    return (
      <div>
        <Alert
          variant={this.props.variant}
          onClose={this.props.handleCloseAlert}
          dismissible
        >
          {this.props.message}
        </Alert>
      </div>
    );
  }
}

export default CustomAlert;
