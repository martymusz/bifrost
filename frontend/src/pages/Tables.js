import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navigation from "../components/common/navigation";
import CustomTable from "../components/common/customTable";
import CustomAlert from "../components/common/alert";
import PopupFormTable from "../components/tables/changeTable";
import AddTimeDim from "../components/tables/timeDimensions";

class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      tables: [],
      metamodels: [],
      roles: "",
      active: 4,
      showAlertModal: false,
      showEditModal: false,
      showTimeDimModal: false,
    };
  }

  headers = [
    "table_id",
    "table_name",
    "table_type",
    "metamodel_name",
    "source_connection_name",
    "sql",
  ];

  pretty_names = [
    "Műveletek",
    "Tábla ID",
    "Tábla név",
    "Tábla típus",
    "Metamodell név",
    "Forrás",
    "SQL",
  ];

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    const role = Cookies.get("role");
    if (authToken) {
      this.setState({ authenticated: true, role: role });
      this.fetchTables();
      this.fetchMetamodels();
    }
  }

  toggleTimeDimModal = () => {
    this.setState((prevState) => ({
      showTimeDimModal: !prevState.showTimeDimModal,
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
        const metamodels = data.map((item) => ({
          value: item.metamodel_id,
          label: item.metamodel_name,
          key: item.metamodel_id,
        }));
        this.setState({ metamodels: metamodels });
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

  addTimeDimension = (
    table_name,
    metamodel_id,
    load_type,
    start_date,
    end_date
  ) => {
    const token = Cookies.get("authToken");
    fetch("/api/tables/add/time", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_name: table_name,
        metamodel_id: metamodel_id,
        load_type: load_type,
        start_date: start_date,
        end_date: end_date,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.setState(
            {
              message: "Idő dimenzió sikeresen hozzáadva!",
              messageVariant: "success",
              showAlert: true,
            },
            () => {
              this.fetchTables();
            }
          );
        } else {
          this.setState({
            message: "Hiba! Idő dimenziót nem sikerült hozzáadni!",
            messageVariant: "danger",
            showAlert: true,
          });
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
          {this.state.showTimeDimModal && (
            <AddTimeDim
              addTimeDimension={this.addTimeDimension}
              toggleTimeDimModal={this.toggleTimeDimModal}
              metamodels={this.state.metamodels}
            />
          )}
        </div>
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
                <div className="row align-items-center">
                  <div className="col-2 p-0 m-0">
                    {this.state.role !== "3" && (
                      <button
                        className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                        onClick={this.navigateToSetupPage}
                      >
                        + Új adattábla
                      </button>
                    )}
                  </div>
                  <div className="col-2 p-0 m-0">
                    {this.state.role !== "3" && (
                      <button
                        className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                        onClick={this.toggleTimeDimModal}
                      >
                        + Új idő dimenzió
                      </button>
                    )}
                  </div>
                </div>
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
                  showEditButton={false}
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

export default function TableWrapper() {
  const navigate = useNavigate();
  return <Tables navigate={navigate} />;
}
