import React, { Component } from "react";
import RolePopup from "./rolePopup";
import { Table } from "react-bootstrap";

class UsersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRolePopup: false,
      selectedUser: 0,
    };

    this.toggleRolePopup = this.toggleRolePopup.bind(this);
  }

  headers = ["Műveletek", "ID", "E-mail", "Név", "Szerep", "Státusz"];

  toggleRolePopup = () => {
    this.setState((prevState) => ({
      showRolePopup: !prevState.showRolePopup,
    }));
  };

  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            {this.headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.props.users.map((user) => (
            <tr key={user.userid}>
              <td>
                {user.active ? (
                  <button
                    className="deact-button"
                    onClick={() =>
                      this.props.changeStatus(user.userid, "deactivate")
                    }
                  ></button>
                ) : (
                  <button
                    className="act-button"
                    onClick={() =>
                      this.props.changeStatus(user.userid, "activate")
                    }
                  ></button>
                )}
                <button
                  className="roles-button"
                  onClick={() => {
                    this.toggleRolePopup();
                    this.setState({ selectedUser: user.userid });
                  }}
                ></button>
                {this.state.showRolePopup && (
                  <RolePopup
                    userid={this.state.selectedUser}
                    toggleRolePopup={this.toggleRolePopup}
                    changeRole={this.props.changeRole}
                  />
                )}
              </td>
              <td>{user.userid}</td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>
                {user.role === 3
                  ? "Elemző"
                  : user.role === 2
                  ? "Adatmodellező"
                  : "Adminisztrátor"}
              </td>
              <td>{user.active ? "Aktív" : "Inaktív"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export default UsersTable;
