import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navigation from "../components/common/navigation";
import CustomTable from "../components/common/table";
import CustomAlert from "../components/common/alert";
import PopupFormTable from "../components/table/changeTable";

class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      tables: [],
      roles: "",
      active: 4,
      showAlertModal: false,
      showEditModal: false,
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
    "sql",
  ];

  pretty_names = [
    "Műveletek",
    "Metamodell ID",
    "Tábla ID",
    "Tábla név",
    "Tábla típus",
    "Forrás",
    "SQL",
  ];

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    const role = Cookies.get("role");
    if (authToken) {
      this.setState({ authenticated: true, role: role });
      this.fetchTables();
    }
  }

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

  navigateToSetupPage = (event) => {
    const navigate = this.props.navigate;
    navigate("/tableSetup");
  };

  fetchTables = async () => {
    const token = Cookies.get("authToken");
    await fetch("/api/tables", {
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

  deleteTable = (row) => {
    const table_id = row.table_id;
    const token = Cookies.get("authToken");
    fetch(`/api/table/${table_id}/remove`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_id: table_id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.setState(
            {
              message: "Tábla törlése sikeres!",
              messageVariant: "success",
              showAlert: true,
            },
            () => {
              this.fetchTables();
            }
          );
        } else {
          this.setState({
            message: "Hiba! A tábla törlése nem sikerült!",
            messageVariant: "danger",
            showAlert: true,
          });
        }
      })
      .catch((error) => {
        console.error("Request failed:", error);
      });
  };

  modifyTable = (table_id, sql) => {
    const token = Cookies.get("authToken");
    fetch(`/api/table/${table_id}/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_id: table_id,
        sql: sql,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.setState(
            {
              message: "Tábla sikeresen módosítva!",
              messageVariant: "success",
              showAlert: true,
            },
            () => {
              this.fetchTables();
            }
          );
        } else {
          this.setState(
            {
              message: "Hiba! A táblát nem sikerült módosítani!",
              messageVariant: "danger",
              showAlert: true,
            },
            () => {
              this.fetchTables();
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
            <PopupFormTable
              row={this.state.rowForEdit}
              modifyTable={this.modifyTable}
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
                    onClick={this.navigateToSetupPage}
                  >
                    + Új adattábla
                  </button>
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
                  data={this.state.tables}
                  pretty_names={this.pretty_names}
                  onDelete={this.deleteTable}
                  onModify={this.openEditModal}
                  showEditButton={true}
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

export default function TableWrapper() {
  const navigate = useNavigate();
  return <Tables navigate={navigate} />;
}
