import React, { Component } from "react";
import Navigation from "../components/common/navigation";
import Cookies from "js-cookie";
import UsersTable from "../components/user/usersTable";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      data: [],
      active: 6
    };

    this.fetchUsers = this.fetchUsers.bind(this);
    this.addUser = this.addUser.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.changeRole = this.changeRole.bind(this);
  }

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      this.setState({ authenticated: true });
      this.fetchUsers();
    }
  }

  fetchUsers = async () => {
    const token = Cookies.get("authToken");
    await fetch("/api/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then(async (response) => await response.json())
      .then((data) => {
        this.setState({ data: data });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  addUser = (email, name, password, role) => {
    const token = Cookies.get("authToken");
    fetch("/api/users/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        password: password,
        role: role,
      }),
    })
      .catch((error) => {
        console.error(error);
      })
      .then(this.fetchUsers)
      .catch((error) => {
        console.error(error);
      });
  };

  changeStatus = (userid, action) => {
    const token = Cookies.get("authToken");
    fetch(`/api/user/${userid}/status`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid: userid, action: action }),
    })
      .then(this.fetchUsers)
      .catch((error) => {
        console.error(error);
      });
  };

  changeRole = (userid, role) => {
    const token = Cookies.get("authToken");
    fetch(`/api/user/${userid}/role`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid: userid, role: role }),
    })
      .catch((error) => {
        console.error(error);
      })
      .then(this.fetchUsers)
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <div>
        {this.state.authenticated ? (
          <React.Fragment>
            <Navigation />
            <UsersTable
              users={this.state.data}
              changeStatus={this.changeStatus}
              changeRole={this.changeRole}
              addUser={this.addUser}
            />
          </React.Fragment>
        ) : (
          <div>
            <h1>Access Denied!</h1>
          </div>
        )}
      </div>
    );
  }
}

export default Users;
