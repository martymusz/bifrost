import Cookies from "js-cookie";
import React, { Component } from "react";

class ChangeName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };
  }

  componentDidMount() {
    const name = Cookies.get("name");
    this.setState({
      name: name,
    });
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.handleSubmit("name", this.state.name);
  };

  render() {
    return (
      <React.Fragment>
        <div className="modal-background">
          <div className="d-flex justify-content-center align-items-center">
            <div className="popup-form-group mx-0">
              <form onSubmit={this.handleSubmit}>
                <label htmlFor="name">Felhasználó neve: </label>
                <input
                  className="form-control"
                  name="name"
                  type="text"
                  id="name"
                  placeholder="Felhasználó neve"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                  required
                />
                <br></br>
                <div className="container d-flex">
                  <button
                    type="submit"
                    className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                  >
                    Módosít
                  </button>
                  <button
                    onClick={this.props.closeModal}
                    className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                  >
                    Mégse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ChangeName;
