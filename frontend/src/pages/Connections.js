import React, { Component } from "react";
import Navigation from "../components/common/navigation";
import Cookies from "js-cookie";
import CustomTable from "../components/common/customTable";
import AddConnection from "../components/connections/addConnection";
import CustomAlert from "../components/common/alert";
import ChangeConnection from "../components/connections/changeConnection";

class Connections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: true,
      connections: [],
      role: "",
      active: 2,
      showAlert: false,
      showAddModal: false,
      showEditModal: false,
      rowForEdit: "",
    };

    this.fetchConnections = this.fetchConnections.bind(this);
    this.modifyConnection = this.modifyConnection.bind(this);
    this.deleteConnection = this.deleteConnection.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  headers = [
    "connection_id",
    "bind_key",
    "database_name",
    "default_schema",
    "database_uri",
  ];

  pretty_names = [
    "Műveletek",
    "ID",
    "Kapcsolat név",
    "Adatbázis név",
    "Adatbázis séma",
    "URL",
  ];

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    const role = Cookies.get("role");
    if (authToken) {
      this.setState({ authenticated: true, role: role });
      this.fetchConnections();
    }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      showAddModal: !prevState.showAddModal,
    }));
  };

  openEditModal = (row) => {
    this.setState((prevState) => ({
      showEditModal: !prevState.showEditModal,
      rowForEdit: row,
    }));
  };

  closeEditModal = () => {
    this.setState((prevState) => ({
      showEditModal: !prevState.showEditModal,
    }));
  };

  handleCloseAlert = () => {
    this.setState({ showAlert: false });
  };

  fetchConnections = async () => {
    const token = Cookies.get("authToken");
    await fetch("/api/connections", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then(async (response) => await response.json())
      .then((data) => {
        const connections = data.map((item) => ({
          connection_id: item.connection_id,
          bind_key: item.bind_key,
          database_name: item.database_name,
          default_schema: item.default_schema,
          database_uri: item.database_uri,
        }));
        this.setState({ connections: connections });
      })
      .catch((error) => {
        console.error(error);
      });
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

  modifyConnection = (
    connection_id,
    bind_key,
    database_uri,
    database_name,
    default_schema,
    driver_name
  ) => {
    const token = Cookies.get("authToken");
    fetch(`/api/connection/${connection_id}/update`, {
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
              message: "Kapcsolat sikeresen módosítva!",
              messageVariant: "success",
              showAlert: true,
            },
            () => {
              this.fetchConnections();
            }
          );
        } else {
          this.setState(
            {
              message: "Hiba! Kapcsolatot nem sikerült módosítani!",
              messageVariant: "danger",
              showAlert: true,
            },
            () => {
              this.fetchConnections();
            }
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  deleteConnection = (row) => {
    const connection_id = row.connection_id;
    const token = Cookies.get("authToken");
    fetch(`/api/connection/${connection_id}/remove`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection_id: connection_id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.setState(
            {
              message: "Kapcsolat törlése sikeres!",
              messageVariant: "success",
              showAlert: true,
            },
            () => {
              this.fetchConnections();
            }
          );
        } else {
          this.setState({
            message: "Hiba! A kapcsolat törlése nem sikerült!",
            messageVariant: "danger",
            showAlert: true,
          });
        }
      })
      .catch((error) => {
        console.error("Request failed:", error);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div>
          {this.state.showEditModal && (
            <ChangeConnection
              row={this.state.rowForEdit}
              modifyConnection={this.modifyConnection}
              closeEditModal={this.closeEditModal}
            />
          )}
        </div>
        {this.state.authenticated ? (
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col p-0 m-0">
                <Navigation active={this.state.active} />
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col p-2">
                {this.state.role !== "3" && (
                  <button
                    className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                    onClick={this.toggleModal}
                  >
                    + Új kapcsolat
                  </button>
                )}
              </div>
            </div>
            <div className="row align-items-left">
              <div className="col">
                {this.state.showAddModal && (
                  <AddConnection
                    fetchConnections={this.fetchConnections}
                    toggleModal={this.toggleModal}
                    addConnection={this.addConnection}
                  />
                )}
              </div>
            </div>
            <div className="row align-items-left">
              <div className="col">
                {this.state.showAlert && (
                  <CustomAlert
                    message={this.state.message}
                    variant={this.state.messageVariant}
                    handleCloseModal={this.handleCloseAlert}
                  />
                )}
              </div>
            </div>
            <div className="row align-items-left">
              <div className="col">
                <CustomTable
                  headers={this.headers}
                  data={this.state.connections}
                  pretty_names={this.pretty_names}
                  onDelete={this.deleteConnection}
                  onModify={this.openEditModal}
                  showEditButton={true}
                  showDeleteButton={true}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1>Access Denied!</h1>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Connections;
