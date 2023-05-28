import React, { Component } from "react";
import Cookies from "js-cookie";
import Navigation from "../components/common/navigation";
import CustomTable from "../components/common/customTable";
import AddMetamodel from "../components/metamodels/addMetamodel";
import CustomAlert from "../components/common/alert";
import ChangeMetamodel from "../components/metamodels/changeMetamodel";

class Metamodels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      metamodels: [],
      showAddModal: false,
      showEditModal: false,
      connections: [],
      role: "",
      active: 3,
    };

    this.fetchMetamodels = this.fetchMetamodels.bind(this);
    this.fetchConnections = this.fetchConnections.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  headers = [
    "metamodel_id",
    "metamodel_name",
    "metamodel_schema",
    "tables",
    "target_connection_id",
  ];

  pretty_names = [
    "Műveletek",
    "ID",
    "Metamodell név",
    "Séma",
    "Táblák",
    "Kapcsolat",
  ];

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    const role = Cookies.get("role");
    if (authToken) {
      this.setState({ authenticated: true, role: role });
      this.fetchMetamodels();
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

  fetchMetamodels = async () => {
    const token = Cookies.get("authToken");
    await fetch("/api/metamodels", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then(async (response) => await response.json())
      .then((data) => {
        this.setState({ metamodels: data });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  fetchConnections = () => {
    const token = Cookies.get("authToken");
    fetch("/api/connections", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const connections = data.map((item) => ({
          value: item.connection_id,
          label: item.bind_key,
          key: item.connection_id,
        }));
        this.setState({ connections: connections });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  addMetamodel = (metamodel_name, metamodel_schema, target_connection_id) => {
    const token = Cookies.get("authToken");
    fetch("/api/metamodels/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metamodel_name: metamodel_name,
        metamodel_schema: metamodel_schema,
        target_connection_id: target_connection_id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.setState(
            {
              message: "Metamodell sikeresen hozzáadva!",
              messageVariant: "success",
              showModal: true,
            },
            () => {
              this.setState(
                {
                  metamodel_name: "",
                  metamodel_schema: "",
                  target_connection_id: "0",
                },
                () => {
                  this.fetchMetamodels();
                }
              );
            }
          );
        } else {
          this.setState(
            {
              message: "Hiba! Metamodellt nem sikerült hozzáadni!",
              messageVariant: "danger",
              showModal: true,
            },
            () => {
              this.fetchMetamodels();
            }
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  deleteMetamodel = (row) => {
    const metamodel_id = row.metamodel_id;
    const token = Cookies.get("authToken");
    fetch(`/api/metamodel/${metamodel_id}/remove`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metamodel_id: metamodel_id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.setState(
            {
              message: "Metamodell törlése sikeres!",
              messageVariant: "success",
              showAlert: true,
            },
            () => {
              this.fetchMetamodels();
            }
          );
        } else {
          this.setState({
            message:
              "Hiba! A metamodell törlése nem sikerült, kérlek ellenőrizd a hivatkozó táblákat és az adatbázis kapcsolatot!",
            messageVariant: "danger",
            showAlert: true,
          });
        }
      })
      .catch((error) => {
        console.error("Request failed:", error);
      });
  };

  modifyMetamodel = (metamodel_id, metamodel_name) => {
    const token = Cookies.get("authToken");
    fetch(`/api/metamodel/${metamodel_id}/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metamodel_name: metamodel_name,
        metamodel_id: metamodel_id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.setState(
            {
              message: "Metamodell sikeresen módosítva!",
              messageVariant: "success",
              showAlert: true,
            },
            () => {
              this.fetchMetamodels();
            }
          );
        } else {
          this.setState(
            {
              message: "Hiba! Metamodellt nem sikerült módosítani!",
              messageVariant: "danger",
              showAlert: true,
            },
            () => {
              this.fetchMetamodels();
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
        <div>
          {this.state.showEditModal && (
            <ChangeMetamodel
              row={this.state.rowForEdit}
              modifyMetamodel={this.modifyMetamodel}
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
                    + Új metamodell
                  </button>
                )}
              </div>
            </div>
            <div className="row align-items-left">
              <div className="col">
                {this.state.showAddModal && (
                  <AddMetamodel
                    addConnection={this.addConnection}
                    toggleModal={this.toggleModal}
                    connections={this.state.connections}
                    addMetamodel={this.addMetamodel}
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
                  data={this.state.metamodels}
                  pretty_names={this.pretty_names}
                  onDelete={this.deleteMetamodel}
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

export default Metamodels;
