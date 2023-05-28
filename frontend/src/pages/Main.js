import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Register from "../components/main/register";
import CustomAlert from "../components/common/alert";

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
    this.handleCloseAlert = this.handleCloseAlert.bind(this);
  }

  loginUser = async (event) => {
    event.preventDefault();
    await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      "Access-Control-Allow-Origin": true,
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          this.setState({
            message:
              "Hiba! A felhasználó nem aktív, vagy a megadott e-mail/jelszó páros nem helyes!",
            messageVariant: "danger",
            showAlert: true,
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const token = data["token"];
        const role = data["user"]["role"];
        const name = data["user"]["name"];
        const userid = data["user"]["userid"];
        const email = data["user"]["email"];
        Cookies.set("authToken", token);
        Cookies.set("name", name);
        Cookies.set("role", role);
        Cookies.set("userid", userid);
        Cookies.set("email", email);
        const navigate = this.props.navigate;
        navigate("/home");
      })
      .catch((error) => {
        console.error("Request failed:", error);
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

  handleCloseAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    return (
      <React.Fragment>
        <div className="mt-5 container">
          <div className="row align-items-center">
            <div className="col-sm-6">
              <h2 className="mb-1 mt-3">Üdv, ez itt a Bifrost.</h2>
              <h3 className="mb-3 mt-3">Kérlek jelentkezz be!</h3>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-sm-6">
              <div className="form-group">
                <form>
                  <label htmlFor="email">E-mail: </label>
                  <input
                    className="form-control"
                    name="email"
                    id="email"
                    type="email"
                    placeholder="E-mail"
                    value={this.state.email}
                    onChange={this.handleInputChange}
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
                  />
                  <br></br>
                  <button
                    type="submit"
                    className="mb-3 mx-2 btn btn-primary d-none d-md-block cornflowerblue"
                    onClick={this.loginUser}
                  >
                    Bejelentkezés
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            {this.state.showAlert && (
              <CustomAlert
                message={this.state.message}
                variant={this.state.messageVariant}
                handleCloseModal={this.handleCloseAlert}
              />
            )}
          </div>
          <div className="row align-items-center">
            <div className="col-sm-6">
              <button
                className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                onClick={this.toggleModal}
              >
                Regisztráció
              </button>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-sm-6">
              {this.state.showModal && (
                <Register toggleModal={this.toggleModal} />
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default function MainWrapper() {
  const navigate = useNavigate();
  return <Main navigate={navigate} />;
}
