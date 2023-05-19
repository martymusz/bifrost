import React, { Component } from "react";
import Navigation from "../components/common/navigation";
import Cookies from "js-cookie";
import Table from "../components/common/table";
import AddConnection from "../components/connection/addConnection";

class Connections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      connections: [],
      showModal: false,
    };

    this.fetchConnections = this.fetchConnections.bind(this);
    this.addConnection = this.addConnection.bind(this);
    this.changeConnection = this.changeConnection.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  headers = [
    "connection_id",
    "bind_key",
    "database_name",
    "default_schema",
    "database_uri",
  ];

  pretty_names = ["ID", "Connection Name", "Database Name", "Schema", "URL"];

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      this.setState({ authenticated: true });
      this.fetchConnections();
    }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };

  fetchConnections = async () => {
    const token = Cookies.get("authToken");
    await fetch("http://127.0.0.1:5000/api/connections", {
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
    driver_name,
    track_modifications
  ) => {
    const token = Cookies.get("authToken");
    fetch("http://127.0.0.1:5000/api/connections/add", {
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
        track_modifications: track_modifications,
      }),
    })
      .catch((error) => {
        console.error(error);
      })
      .then(this.fetchConnections)
      .catch((error) => {
        console.error(error);
      });
  };

  changeConnection = (
    bind_key,
    database_uri,
    database_name,
    default_schema,
    driver_name,
    track_modifications
  ) => {
    const token = Cookies.get("authToken");
    fetch("http://127.0.0.1:5000/api/users/add", {
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
        track_modifications: track_modifications,
      }),
    })
      .catch((error) => {
        console.error(error);
      })
      .then(this.fetchUsers)
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <div>
        {this.state.authenticated ? (
          <React.Fragment>
            <Navigation />
            <button className="add-button" onClick={this.toggleModal}>
              + Add Connection
            </button>
            {this.state.showModal && (
              <AddConnection
                addConnection={this.addConnection}
                toggleModal={this.toggleModal}
              />
            )}
            <Table
              headers={this.headers}
              data={this.state.connections}
              pretty_names={this.pretty_names}
            />
          </React.Fragment>
        ) : (
          <div>
            <h1>Access Denied!</h1>
          </div>
        )}
      </div>
    );
  }
}

export default Connections;
