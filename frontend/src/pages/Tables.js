import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navigation from "../components/common/navigation";
import Table from "../components/common/table";

class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      tables: [],
      showModal: false,
    };

    this.fetchTables = this.fetchTables.bind(this);
    this.navigateToSetupPage = this.navigateToSetupPage.bind(this);
  }

  headers = [
    "metamodel_id",
    "table_id",
    "table_name",
    "table_type",
    "source_connection_id",
    "dimension_type",
    "dimension_key",
  ];

  pretty_names = [
    "Metamodel ID",
    "Table ID",
    "Table Name",
    "Table Type",
    "Source Connection",
    "Dimension",
    "Dimension Key",
  ];

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      this.setState({ authenticated: true });
      this.fetchTables();
    }
  }

  navigateToSetupPage = (event) => {
    const navigate = this.props.navigate;
    navigate("/tableSetup");
  };

  fetchTables = async () => {
    const token = Cookies.get("authToken");
    await fetch("http://127.0.0.1:5000/api/tables", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then(async (response) => await response.json())
      .then((data) => {
        this.setState({ tables: data });
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
            <button className="add-button" onClick={this.navigateToSetupPage}>
              + Add Table
            </button>
            <Table
              headers={this.headers}
              data={this.state.tables}
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

export default function TableWrapper() {
  const navigate = useNavigate();
  return <Tables navigate={navigate} />;
}
