import React, { Component } from "react";
import RadioSelect from "../common/radioSelect";
import CustomAlert from "../common/alert";
import Cookies from "js-cookie";

class AddConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bind_key: "",
      database_uri: "",
      database_name: "",
      default_schema: "",
      driver_name: "",
      showModal: false,
      message: "",
      messageVariant: "",
    };

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addConnection = this.addConnection.bind(this);
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
    this.addConnection(
      this.state.bind_key,
      this.state.database_uri,
      this.state.database_name,
      this.state.default_schema,
      this.state.driver_name
    );
  };

  handleShowModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  addConnection = (
    bind_key,
    database_uri,
    database_name,
    default_schema,
    driver_name
  ) => {
    const token = Cookies.get("authToken");
    fetch("/api/connections/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bind_key: bind_key,
        database_uri: database_uri,
        database_name: database_name,
        default_schema: default_schema,
        driver_name: driver_name,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.setState(
            {
              message: "Kapcsolat sikeresen hozzáadva!",
              messageVariant: "success",
              showModal: true,
            },
            () => {
              this.setState(
                {
                  bind_key: "",
                  database_uri: "",
                  database_name: "",
                  default_schema: "",
                  driver_name: "",
                },
                () => {
                  this.props.fetchConnections();
                }
              );
            }
          );
        } else {
          this.setState(
            {
              message: "Hiba! Kapcsolatot nem sikerült hozzáadni!",
              messageVariant: "danger",
              showModal: true,
            },
            () => {
              this.props.fetchConnections();
            }
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div className="mt-2 ml-2 container-fluid">
          <div className="row justify-content-start">
            <div className="col grey">
              <div className="form-group">
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
                  <button
                    type="submit"
                    className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                  >
                    Eküld
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {this.state.showModal && (
                <CustomAlert
                  message={this.state.message}
                  variant={this.state.messageVariant}
                  handleCloseModal={this.props.toggleModal}
                />
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AddConnection;
