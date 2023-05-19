import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Register from "../components/register";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showModal: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  loginUser = async (event) => {
    event.preventDefault();
    await fetch("http://127.0.0.1:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      "Access-Control-Allow-Origin": true,
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then(async (response) => await response.json())
      .then((data) => {
        const token = data["token"];
        const role = data["user"]["role"];
        const name = data["user"]["name"];
        Cookies.set("authToken", token);
        Cookies.set("user", name);
        Cookies.set("role", role);
        const navigate = this.props.navigate;
        navigate("/home");
      })
      .catch((error) => {
        console.error("Authentication failed", error);
      });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <div className="main">
            <span>Welcome to Bifrost!</span>
            <br></br>
            <span>Please login or register!</span>
            <br></br>
          </div>
          <div className="login">
            <table className="login-inner">
              <tbody>
                <tr>
                  <td>
                    <form onSubmit={this.loginUser}>
                      <table>
                        <tbody>
                          <tr>
                            <td>E-mail: </td>
                            <td>
                              <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={this.state.email}
                                onChange={this.handleInputChange}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Password: </td>
                            <td>
                              <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <br></br>
                      <button type="submit">Login</button>
                    </form>
                  </td>
                </tr>
                <tr>
                  <td>
                    <button onClick={this.toggleModal}>Register</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          {this.state.showModal ? (
            <Register toggleModal={this.toggleModal} />
          ) : (
            <div></div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default function MainWrapper() {
  const navigate = useNavigate();
  return <Main navigate={navigate} />;
}
