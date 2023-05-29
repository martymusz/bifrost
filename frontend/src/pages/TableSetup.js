import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navigation from "../components/common/navigation";
import DropDown from "../components/common/dropDown";
import ColumnTree from "../components/tableSetup/columnTree";
import Canvas from "../components/tableSetup/canvas";
import RadioSelect from "../components/common/radioSelect";
import JoinSetup from "../components/tableSetup/joinSetup";
import Join from "../components/tableSetup/join";
import FilterSetup from "../components/tableSetup/filterSetup";
import Filter from "../components/tableSetup/filter";
import CustomAlert from "../components/common/alert";
import Checklist from "../components/tableSetup/checklist";

class TableSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      metamodels: [],
      connections: [],
      source_connection_id: "",
      metamodel_id: "",
      table_name: "",
      tables: [],
      showColumnTree: false,
      showAlert: false,

      table_type: "",
      dimension_type: "",
      dimension_key: "",

      selected_tables: [],
      selected_columns: [],
      source_table: "",

      joins: [],
      showjoinsPopup: false,
      joinSetupRequired: false,

      filters: [],
      showFiltersPopup: false,

      setupComplete: false,
      check_joins: false,
      check_name: false,
      check_metamodel: false,
      check_columns: false,
      check_tables: false,
      check_table_type: false,
      check_dim_key: false,
    };
  }

  tableOptions = [
    { name: "tabletype", value: "fact", label: "Tény", key: 0 },
    { name: "tabletype", value: "dimension", label: "Dimenzió", key: 1 },
    { name: "tabletype", value: "view", label: "Nézet", key: 2 },
  ];

  dimOptions = [
    { name: "dimtype", value: "noversion", label: "Nem historizált", key: 3 },
    { name: "dimtype", value: "versioned", label: "Historizált", key: 4 },
  ];

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      this.setState({ authenticated: true });
      this.fetchMetaModels();
      this.fetchConnections();
      this.checkSetupComplete();
    }
  }

  navigateToTablePage = (event) => {
    const navigate = this.props.navigate;
    navigate("/tables");
  };

  checkSetupComplete = () => {
    const check_joins =
      (!this.state.joinSetupRequired && this.state.joins.length === 0) ||
      (this.state.joinSetupRequired && this.state.joins.length !== 0);
    const check_name = this.state.table_name !== "";
    const check_metamodel = this.state.metamodel_id !== "";
    const check_columns = this.state.selected_columns.length !== 0;
    const check_tables = this.state.selected_tables.length !== 0;
    const check_table_type = this.state.table_type !== "";
    const check_dim_key =
      this.state.table_type !== "dimension" ||
      (this.state.table_type === "dimension" &&
        this.state.dimension_key !== "");

    this.setState({
      setupComplete:
        check_joins &&
        check_name &&
        check_metamodel &&
        check_columns &&
        check_tables &&
        check_table_type &&
        check_dim_key,
      check_joins: check_joins,
      check_name: check_name,
      check_metamodel: check_metamodel,
      check_columns: check_columns,
      check_tables: check_tables,
      check_table_type: check_table_type,
      check_dim_key: check_dim_key,
    });
  };

  handleCloseAlert = () => {
    this.setState({ showAlert: false });
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

  fetchTables = async (connection_id) => {
    const token = Cookies.get("authToken");
    await fetch(`/api/connection/${connection_id}/tables`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection_id: connection_id,
      }),
    })
      .then(async (response) => await response.json())
      .then((data) => {
        this.setState({ tables: data }, () => {
          this.setState({ showColumnTree: true });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  selectTableType = (selectedValue) => {
    this.setState({ table_type: selectedValue }, () => {
      this.checkSetupComplete();
    });
  };

  selectDimType = (selectedValue) => {
    if (selectedValue) {
      this.setState({ dimension_type: selectedValue }, () => {
        this.checkSetupComplete();
      });
    }
  };

  handleDimKeyChange = (event) => {
    const dimension_key = event.target.value;
    this.setState({ dimension_key: dimension_key }, () => {
      this.checkSetupComplete();
    });
  };

  selectMetamodel = (selectedValue) => {
    this.setState({ metamodel_id: selectedValue }, () => {
      this.checkSetupComplete();
    });
  };

  handleTableNameChange = (event) => {
    const name = event.target.value;
    this.setState({ table_name: name }, () => {
      this.checkSetupComplete();
    });
  };

  renderColumnTree = async (selectedValue) => {
    this.setState({
      showColumnTree: false,
      source_connection_id: selectedValue,
    });
    this.fetchTables(selectedValue);
  };

  addRemoveColumn = (columns) => {
    if (columns) {
      const keys = [...new Set(columns.map((column) => column.table_name))];
      this.setState({
        selected_columns: columns,
        selected_tables: keys,
      });
      if (keys.length > 1) {
        this.setState({ joinSetupRequired: true });
      } else {
        this.setState({
          joinSetupRequired: false,
          joins: [],
        });
      }
    }
    this.checkSetupComplete();
  };

  toggleJoinsPopup = () => {
    this.setState((prevState) => ({
      showjoinsPopup: !prevState.showjoinsPopup,
    }));
  };

  addJoin = (join) => {
    this.toggleJoinsPopup();
    this.setState(
      (prevState) => ({ joins: [...prevState.joins, join] }),
      () => {
        console.log("Added join: ", this.state.joins);
        this.checkSetupComplete();
      }
    );
  };

  removeJoin = (condition) => {
    const removedJoin = this.state.joins.filter(
      (join) => join.condition !== condition
    );
    this.setState({ joins: removedJoin }, () => {
      this.checkSetupComplete();
    });
  };

  toggleFiltersPopup = () => {
    this.setState((prevState) => ({
      showFiltersPopup: !prevState.showFiltersPopup,
    }));
  };

  addFilter = (filter) => {
    this.toggleFiltersPopup();
    this.setState(
      (prevState) => ({ filters: [...prevState.filters, filter] }),
      () => {
        this.checkSetupComplete();
      }
    );
  };

  removeFilter = (condition) => {
    const removedFilter = this.state.filters.filter(
      (filter) => filter.condition !== condition
    );
    this.setState({ filters: removedFilter }, () => {
      this.checkSetupComplete();
    });
  };

  addTable = () => {
    const joins_processed = [];
    const array = this.state.joins;

    if (array.length !== 0) {
      array.sort((a, b) => {
        const compare = a.table_name.localeCompare(b.table_name);
        if (a.table_name !== b.table_name) {
          return compare;
        } else {
          return a.joined_table.localeCompare(b.joined_table);
        }
      });

      const filteredjoins = array.filter(
        (item) => item.joined_table !== item.table_name
      );

      joins_processed.push({
        table_name: filteredjoins[0].joined_table,
        join_type: parseInt(filteredjoins[0].join_type),
        join_condition: filteredjoins[0].condition,
      });

      const source_table = filteredjoins[0].table_name;

      filteredjoins.forEach((join, index) => {
        const joined_table_found = joins_processed.some(
          (obj) => obj["table_name"] === join.joined_table
        );
        const table_found = joins_processed.some(
          (obj) => obj["table_name"] === join.table_name
        );

        if (
          index > 0 &&
          source_table === join.table_name &&
          joined_table_found
        ) {
          const i = joins_processed.findIndex(
            (obj) => obj["table_name"] === join.joined_table
          );
          joins_processed[i].join_condition += " AND " + join.condition;
        } else if (
          index > 0 &&
          source_table === join.joined_table &&
          table_found
        ) {
          const i = joins_processed.findIndex(
            (obj) => obj["table_name"] === join.table_name
          );
          joins_processed[i].join_condition += " AND " + join.condition;
        } else if (
          index > 0 &&
          source_table !== join.table_name &&
          joined_table_found &&
          table_found
        ) {
          const i = joins_processed.findIndex(
            (obj) => obj["table_name"] === join.joined_table
          );
          joins_processed[i].join_condition += " AND " + join.condition;
        } else if (
          index > 0 &&
          source_table !== join.joined_table &&
          source_table !== join.table_name &&
          !table_found & joined_table_found
        ) {
          joins_processed.push({
            table_name: join.table_name,
            join_type: parseInt(join.join_type),
            join_condition: join.condition,
          });
        } else if (
          index > 0 &&
          source_table !== join.joined_table &&
          source_table !== join.table_name &&
          !joined_table_found &&
          table_found
        ) {
          joins_processed.push({
            table_name: join.joined_table,
            join_type: parseInt(join.join_type),
            join_condition: join.condition,
          });
        } else if (
          index > 0 &&
          source_table === join.table_name &&
          !joined_table_found &&
          table_found
        ) {
          joins_processed.push({
            table_name: join.joined_table,
            join_type: parseInt(join.join_type),
            join_condition: join.condition,
          });
        } else if (
          index > 0 &&
          source_table === join.table_name &&
          !table_found &&
          joined_table_found
        ) {
          joins_processed.push({
            table_name: join.table_name,
            join_type: parseInt(join.join_type),
            join_condition: join.condition,
          });
        }
      });

      this.setState(
        {
          source_table: source_table,
          joins_processed: joins_processed,
        },
        () => console.log(this.state)
      );
    }

    const token = Cookies.get("authToken");
    fetch("/api/tables/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_name: this.state.table_name,
        table_type: this.state.table_type,
        dimension_type: this.state.dimension_type,
        dimension_key: this.state.dimension_key,
        source_connection_id: parseInt(this.state.source_connection_id),
        metamodel_id: parseInt(this.state.metamodel_id),
        columns: this.state.selected_columns,
        source_table: this.state.source_table,
        joins: this.state.joins,
        filters: this.state.filters,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.setState({
            message: "Adattábla létrehozása sikeres!",
            messageVariant: "success",
            showAlert: true,
          });
          this.navigateToTablePage();
        } else {
          this.setState({
            message: "Hiba! Az adattábla létrehozása nem sikerült!",
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
        <DndProvider backend={HTML5Backend}>
          <div className="container-fluid">
            <div className="row">
              <div className="col p-0 m-0">
                <Navigation active={this.state.active} />
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
            <div className="row">
              <div className="col-2 p-2 my-4 mx-1 border-grey">
                <div className="row m-0 p-0">
                  <div className="col m-0 p-0 d-flex justify-content-left">
                    <DropDown
                      options={this.state.metamodels}
                      handleSelection={this.selectMetamodel}
                      display={"Metamodell"}
                      className="dropdown"
                    />
                    <DropDown
                      options={this.state.connections}
                      handleSelection={this.renderColumnTree}
                      display={"Forrás"}
                      className="dropdown"
                    />
                  </div>
                </div>
                <label htmlFor="table_name">Tábla neve: </label>
                <input
                  id="table_name"
                  className="p-0 m-2"
                  type="text"
                  name="table_name"
                  value={this.state.table_name}
                  onChange={this.handleTableNameChange}
                />
                <button
                  className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                  onClick={this.addTable}
                  disabled={!this.state.setupComplete}
                >
                  + Tábla mentése
                </button>
              </div>
              <div className="col-3 p-2 my-4 mx-2 border-grey">
                <button
                  className="mb-3 mx- btn btn-primary d-none d-md-block coral"
                  onClick={this.toggleJoinsPopup}
                  disabled={!this.state.joinSetupRequired}
                >
                  + Join hozzáadása
                </button>
                {this.state.showjoinsPopup && (
                  <JoinSetup
                    columns={this.state.tables}
                    tables={this.state.selected_tables}
                    addJoin={this.addJoin}
                    toggleJoinsPopup={this.toggleJoinsPopup}
                  />
                )}
                {this.state.joins.map((join, index) => (
                  <div className="join" key={index}>
                    <Join
                      condition={join.condition}
                      index={index}
                      removeJoin={this.removeJoin}
                    />
                  </div>
                ))}
              </div>
              <div className="col-3 p-2 my-4 mx-1 border-grey">
                <button
                  className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                  onClick={this.toggleFiltersPopup}
                  disabled={this.state.selected_tables.length === 0}
                >
                  + Filter hozzáadása
                </button>
                {this.state.showFiltersPopup && (
                  <FilterSetup
                    columns={this.state.tables}
                    tables={this.state.selected_tables}
                    addFilter={this.addFilter}
                    toggleFiltersPopup={this.toggleFiltersPopup}
                  />
                )}
                {this.state.filters.map((filter, index) => (
                  <div className="join" key={index}>
                    <Filter
                      condition={filter.condition}
                      index={index}
                      removeFilter={this.removeFilter}
                    />
                  </div>
                ))}
              </div>
              <div className="col-3 p-2 m-4 border-grey">
                <RadioSelect
                  handleRadioSelection={this.selectTableType}
                  options={this.tableOptions}
                />
                <br></br>
                {this.state.table_type === "dimension" && (
                  <RadioSelect
                    handleRadioSelection={this.selectDimType}
                    options={this.dimOptions}
                  />
                )}
                {this.state.table_type === "dimension" && (
                  <div className="col p-1 m-1">
                    <label htmlFor="dimension_key">Dimenzió kulcs: </label>
                    <input
                      className="p-0 mx-2"
                      type="text"
                      name="dimension_key"
                      value={this.state.dimension_key}
                      onChange={this.handleDimKeyChange}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-2 p-2 m-2 border-grey">
                {this.state.showColumnTree && (
                  <ColumnTree data={this.state.tables} />
                )}
              </div>
              <div className="col-6 p-2 m-2 border-grey">
                <Canvas addRemoveColumn={this.addRemoveColumn} />
              </div>
              <div className="col-3 p-2 my-2 mx-3 border-grey">
                <Checklist
                  key={this.state.refreshKey}
                  check_joins={this.state.check_joins}
                  check_name={this.state.check_name}
                  check_metamodel={this.state.check_metamodel}
                  check_columns={this.state.check_columns}
                  check_tables={this.state.check_tables}
                  check_table_type={this.state.check_table_type}
                  check_dim_key={this.state.check_dim_key}
                />
              </div>
            </div>
          </div>
        </DndProvider>
      </React.Fragment>
    );
  }
}

export default function TableWrapper() {
  const navigate = useNavigate();
  return <TableSetup navigate={navigate} />;
}
