import React, { Component } from "react";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      role: "3",
      name: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.addUser(
      this.state.email,
      this.state.name,
      this.state.password,
      this.state.role
    );
    this.setState({ email: "", name: "", password: "", role: "" });
    this.props.toggleModal();
  };

  addUser = (email, name, password, role) => {
    fetch("http://127.0.0.1:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        password: password,
        role: role,
      }),
    })
      .then(async (response) => await response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="register">
        <div className="add-modal">
          <form onSubmit={this.handleSubmit}>
            <table className="modal-table">
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="metamodel_name">E-mail: </label>
                  </td>
                  <td>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleInputChange}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="password">Password: </label>
                  </td>
                  <td>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleInputChange}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="Name">Name:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleInputChange}
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br></br>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
