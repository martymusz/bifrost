import React, { Component } from "react";
import CustomAlert from "../common/alert";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
      message: "",
      messageVariant: "",
      showModal: false,
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
    this.addUser(this.state.email, this.state.name, this.state.password);
  };

  addUser = (email, name, password) => {
    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        password: password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.setState(
            {
              message: "Felhasználó regisztráció sikeres!",
              messageVariant: "success",
              showModal: true,
            },
            () => {
              this.setState({ email: "", name: "", password: "" });
            }
          );
        } else {
          this.setState({
            message: "Hiba! A felhasználó már létezik!",
            messageVariant: "danger",
            showModal: true,
          });
        }
      })
      .catch((error) => {
        console.error("Request failed:", error);
      });
  };

  handleShowModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    return (
      <React.Fragment>
        <div className="mt-2 container">
          <div className="form-group">
            <form onSubmit={this.handleSubmit}>
              <label htmlFor="email">E-mail: </label>
              <input
                className="form-control"
                name="email"
                type="email"
                id="email"
                placeholder="E-mail"
                value={this.state.email}
                onChange={this.handleInputChange}
                required
              />
              <br></br>
              <label htmlFor="name">Név: </label>
              <input
                className="form-control"
                name="name"
                id="name"
                type="text"
                placeholder="Név"
                value={this.state.name}
                onChange={this.handleInputChange}
                required
              />
              <br></br>
              <label htmlFor="password">Jelszó: </label>
              <input
                className="form-control"
                name="password"
                id="password"
                type="password"
                placeholder="Jelszó"
                value={this.state.password}
                onChange={this.handleInputChange}
                required
              />
              <br></br>
              <button
                type="submit"
                className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
              >
                Eküld
              </button>
            </form>
            {this.state.showModal && (
              <CustomAlert
                message={this.state.message}
                variant={this.state.messageVariant}
                handleCloseModal={this.handleCloseModal}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Register;
