import React, { Component } from "react";
import RadioSelect from "../common/radioSelect";
import "../../css/AddModal.css";

class AddConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bind_key: "",
      database_uri: "",
      database_name: "",
      default_schema: "",
      driver_name: "",
      track_modifications: false,
    };

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  radioOptions = [
    { name: "driver", value: "postgresql", label: "PostgreSQL", key: 1 },
    { name: "driver", value: "mssql", label: "SQL Server", key: 2 },
    { name: "driver", value: "mysql", label: "MySQL", key: 3 },
  ];

  handleOptionChange = (selectedValue) => {
    const driver_name = selectedValue;
    this.setState({ driver_name: driver_name });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.addConnection(
      this.state.bind_key,
      this.state.database_uri,
      this.state.database_name,
      this.state.default_schema,
      this.state.driver_name,
      this.state.track_modifications
    );
    this.setState(
      { bind_key: "" },
      { database_uri: "" },
      { database_name: "" },
      { default_schema: "" },
      { driver_name: "" },
      { track_modifications: false }
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
                  <label htmlFor="bind_key">Connection Name: </label>
                </td>
                <td>
                  <input
                    type="text"
                    id="bind_key"
                    name="bind_key"
                    value={this.state.bind_key}
                    onChange={this.handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="database_uri">Database URL: </label>
                </td>
                <td>
                  <input
                    type="text"
                    id="database_uri"
                    name="database_uri"
                    value={this.state.database_uri}
                    onChange={this.handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="database_name">Database Name: </label>
                </td>
                <td>
                  <input
                    type="text"
                    id="database_name"
                    name="database_name"
                    value={this.state.database_name}
                    onChange={this.handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="default_schema">Default Schema: </label>
                </td>
                <td>
                  <input
                    type="text"
                    id="default_schema"
                    name="default_schema"
                    value={this.state.default_schema}
                    onChange={this.handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Database type:</td>
                <td>
                  <div className="radio-container">
                    <RadioSelect
                      handleRadioSelection={this.handleOptionChange}
                      options={this.radioOptions}
                    />
                  </div>
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

export default AddConnection;
