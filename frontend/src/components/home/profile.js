import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";
import { AiOutlineEdit } from "react-icons/ai";

class ProfileTable extends Component {
  render() {
    return (
      <Table striped bordered hover>
        <thead></thead>
        <tbody>
          <tr>
            <td>
              <Button
                className="mx-1 edit-button"
                onClick={this.props.openNameModal}
              >
                <AiOutlineEdit />
              </Button>
            </td>
            <td>Felhasználónév: {this.props.name}</td>
            <td>E-mail: {this.props.email}</td>
            <td>
              Szerepkör:
              {this.props.role === 3
                ? " Elemző"
                : this.props.role === 2
                ? " Adatmodellező"
                : " Adminisztrátor"}
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

export default ProfileTable;
