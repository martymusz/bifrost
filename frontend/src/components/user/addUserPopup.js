import React, { Component } from "react";

class AddUserPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      password: "",
      role: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
    this.props.addUser(
      this.state.email,
      this.state.name,
      this.state.password,
      this.state.role
    );
    this.setState({ email: "", name: "", password: "", role: "" });
    this.props.toggleUserPopup();
  };

  handleTextChange = (event) => {
    const email = event.target.form.email.value;
    const name = event.target.form.name.value;
    const password = event.target.form.password.value;
    this.setState({ email: email, name: name, password: password });
  };

  handleOptionChange = (event) => {
    const role = event.target.value;
    this.setState({ role: role });
  };

  render() {
    return (
      <div className="popup" id="newuser">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="email">E-mail:</label>
          <br></br>
          <input
            type="text"
            id="email"
            name="email"
            onChange={this.handleTextChange}
          ></input>
          <br></br>

          <label htmlFor="name">Name:</label>
          <br></br>
          <input
            type="text"
            id="name"
            name="name"
            onChange={this.handleTextChange}
          ></input>
          <br></br>

          <label htmlFor="password">Password:</label>
          <br></br>
          <input
            type="text"
            id="password"
            name="password"
            onChange={this.handleTextChange}
          ></input>
          <br></br>

          <input
            type="radio"
            id="1"
            name="roles"
            value="1"
            onChange={this.handleOptionChange}
            checked={this.state.role === "1"}
          ></input>
          <label htmlFor="Administrator">Administrator</label>
          <input
            type="radio"
            id="2"
            name="roles"
            value="2"
            onChange={this.handleOptionChange}
            checked={this.state.role === "2"}
          ></input>
          <label htmlFor="Data Modeler">Data Modeler</label>
          <input
            type="radio"
            id="3"
            name="roles"
            value="3"
            onChange={this.handleOptionChange}
            checked={this.state.role === "3"}
          ></input>
          <label htmlFor="Analyst">Analyst</label>
          <br></br>

          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
export default AddUserPopup;
