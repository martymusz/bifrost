import React, { Component } from "react";
import DropDown from "../common/dropDown";

class AddMetamodel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metamodel_name: "",
      metamodel_schema: "",
      target_connection_id: "0",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSelection = (selectedValue) => {
    this.setState({ target_connection_id: selectedValue }, () => {
      console.log(this.state);
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
    this.props.addMetamodel(
      this.state.metamodel_name,
      this.state.metamodel_schema,
      parseInt(this.state.target_connection_id)
    );
    this.props.toggleModal();
  };

  render() {
    return (
      <div className="add-modal">
        <form onSubmit={this.handleSubmit}>
          <table className="modal-table">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="metamodel_name">Metamodel Name: </label>
                </td>
                <td>
                  <input
                    type="text"
                    id="metamodel_name"
                    name="metamodel_name"
                    value={this.state.metamodel_name}
                    onChange={this.handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="metamodel_schema">Metamodel Schema: </label>
                </td>
                <td>
                  <input
                    type="text"
                    id="metamodel_schema"
                    name="metamodel_schema"
                    value={this.state.metamodel_schema}
                    onChange={this.handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="target_connection_id">
                    Target Connection:
                  </label>
                </td>
                <td>
                  <DropDown
                    options={this.props.connections}
                    handleSelection={this.handleSelection}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button className="submit-button" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default AddMetamodel;
