import React, { Component } from "react";
import Cookies from "js-cookie";
import Navigation from "../components/common/navigation";
import Table from "../components/common/table";
import AddMetamodel from "../components/metamodel/addMetamodel";

class Metamodels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      metamodels: [],
      showModal: false,
      connections: [],
    };

    this.fetchMetaModels = this.fetchMetaModels.bind(this);
    this.fetchConnections = this.fetchConnections.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.addMetamodel = this.addMetamodel.bind(this);
  }

  headers = [
    "metamodel_id",
    "metamodel_name",
    "metamodel_schema",
    "tables",
    "target_connection_id",
  ];

  pretty_names = [
    "ID",
    "Metamodel Name",
    "Schema",
    "Tables",
    "Target Connection",
  ];

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      this.setState({ authenticated: true });
      this.fetchMetaModels();
      this.fetchConnections();
    }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
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
      .catch((error) => {
        console.error(error);
      })
      .then(this.fetchMetaModels)
      .catch((error) => {
        console.error(error);
      });
  };

  fetchMetaModels = async () => {
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

  render() {
    return (
      <div>
        {this.state.authenticated ? (
          <React.Fragment>
            <Navigation />
            <button className="add-button" onClick={this.toggleModal}>
              + Add Metamodel
            </button>
            {this.state.showModal && (
              <AddMetamodel
                addConnection={this.addConnection}
                toggleModal={this.toggleModal}
                connections={this.state.connections}
                addMetamodel={this.addMetamodel}
              />
            )}
            <Table
              headers={this.headers}
              data={this.state.metamodels}
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

export default Metamodels;
