import React, { Component } from "react";
import RadioSelect from "../common/radioSelect";

class PopupFormConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connection_id: "",
      bind_key: "",
      database_uri: "",
      database_name: "",
      default_schema: "",
      driver_name: "",
    };
  }

  componentDidMount() {
    this.setState({
      connection_id: this.props.row.connection_id,
      bind_key: this.props.row.bind_key,
      database_uri: this.props.row.database_uri,
      database_name: this.props.row.database_name,
      default_schema: this.props.row.default_schema,
      driver_name: this.props.row.driver_name,
    });
  }

  radioOptions = [
    {
      name: "driver",
      value: "postgresql",
      label: "PostgreSQL",
      key: 1,
      id: "0",
    },
    { name: "driver", value: "mssql", label: "SQL Server", key: 2, id: "1" },
    { name: "driver", value: "mysql", label: "MySQL", key: 3, id: "2" },
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
    this.props.modifyConnection(
      this.state.connection_id,
      this.state.bind_key,
      this.state.database_uri,
      this.state.database_name,
      this.state.default_schema,
      this.state.driver_name
    );
    this.props.closeEditModal();
  };

  render() {
    return (
      <React.Fragment>
        <div className="modal-background">
          <div className="d-flex justify-content-center align-items-center">
            <div className="popup-form-group mx-0">
              <form onSubmit={this.handleSubmit}>
                <label htmlFor="bind_key">Kapcsolat név: </label>
                <input
                  className="form-control"
                  name="bind_key"
                  type="text"
                  id="bind_key"
                  placeholder="Kapcsolat név"
                  value={this.state.bind_key}
                  onChange={this.handleInputChange}
                  required
                />
                <br></br>
                <label htmlFor="database_uri">Adatbázis link:</label>
                <input
                  className="form-control"
                  name="database_uri"
                  type="text"
                  id="database_uri"
                  placeholder="Adatbázis link"
                  value={this.state.database_uri}
                  onChange={this.handleInputChange}
                  required
                />
                <br></br>
                <label htmlFor="database_name">Adatbázis név: </label>
                <input
                  className="form-control"
                  name="database_name"
                  id="database_name"
                  type="text"
                  placeholder="Adatbázis név"
                  value={this.state.database_name}
                  onChange={this.handleInputChange}
                  required
                />
                <br></br>
                <label htmlFor="default_schema">Adatbázis séma: </label>
                <input
                  className="form-control"
                  name="default_schema"
                  id="default_schema"
                  type="text"
                  placeholder="Adatbázis séma"
                  value={this.state.default_schema}
                  onChange={this.handleInputChange}
                  required
                />
                <br></br>
                <RadioSelect
                  handleRadioSelection={this.handleOptionChange}
                  options={this.radioOptions}
                />
                <br></br>
                <div className="container d-flex">
                  <button
                    type="submit"
                    className="mb-3 mx-4 btn btn-primary d-none d-md-block coral"
                  >
                    Módosít
                  </button>
                  <button
                    type="submit"
                    className="mb-3 mx-4 btn btn-primary d-none d-md-block coral"
                    onClick={this.props.closeEditModal}
                  >
                    Mégsem
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

export default PopupFormConnection;
