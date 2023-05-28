import React, { Component } from "react";
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

      table_type: "",
      dimension_type: "",
      dimension_key: "",

      selected_tables: [],
      selected_columns: [],
      source_table: "",

      joins: [],
      joinsRerender: true,
      showjoinsPopup: false,
      joinSetupRequired: false,
    };

    this.renderColumnTree = this.renderColumnTree.bind(this);
    this.fetchConnections = this.fetchConnections.bind(this);
    this.fetchTables = this.fetchTables.bind(this);
    this.selectTableType = this.selectTableType.bind(this);
    this.selectDimType = this.selectDimType.bind(this);
    this.handleDimKeyChange = this.handleDimKeyChange.bind(this);
    this.handleTableNameChange = this.handleTableNameChange.bind(this);
    this.renderColumnTree = this.renderColumnTree.bind(this);
    this.toggleJoinsPopup = this.toggleJoinsPopup.bind(this);
    this.addRemoveColumn = this.addRemoveColumn.bind(this);
    this.addJoin = this.addJoin.bind(this);
    this.removeJoin = this.removeJoin.bind(this);
  }

  tableOptions = [
    { name: "tabletype", value: "fact", label: "Fact", key: 0 },
    { name: "tabletype", value: "dim", label: "Dimension", key: 1 },
    { name: "tabletype", value: "view", label: "View", key: 2 },
  ];

  dimOptions = [
    { name: "dimtype", value: "noversion", label: "No History", key: 3 },
    { name: "dimtype", value: "versioned", label: "Historization", key: 4 },
  ];

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      this.setState({ authenticated: true });
      this.fetchMetaModels();
      this.fetchConnections();
    }
  }

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
    this.setState({ table_type: selectedValue });
  };

  selectDimType = (selectedValue) => {
    if (selectedValue) {
      this.setState({ dimension_type: selectedValue });
    }
  };

  handleDimKeyChange = (event) => {
    const dimension_key = event.target.value;
    this.setState({ dimension_key: dimension_key });
  };

  selectMetamodel = (selectedValue) => {
    console.log(selectedValue);
    this.setState({ metamodel_id: selectedValue });
  };

  handleTableNameChange = (event) => {
    const name = event.target.value;
    this.setState({ table_name: name });
  };

  renderColumnTree = async (selectedValue) => {
    this.setState({
      showColumnTree: false,
      source_connection_id: selectedValue,
    });
    this.fetchTables(selectedValue);
    this.setState({
      tableType: "",
      historization: false,

      selected_tables: [],
      selected_columns: [],
      joins: [],
      joinSetupRequired: false,
    });
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
      }
    );
  };

  removeJoin = (condition) => {
    const removedJoin = this.state.joins.filter(
      (join) => join.condition !== condition
    );
    this.setState({ joins: removedJoin }, () => {
      console.log(this.state.joins);
    });
  };

  addTable = () => {
    const joins_processed = [];
    const array = this.state.joins;

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

      if (index > 0 && source_table === join.table_name && joined_table_found) {
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

    console.log(joins_processed);

    this.setState(
      {
        source_table: source_table,
        joins_processed: joins_processed,
      },
      () => console.log(this.state)
    );

    /*
    const token = Cookies.get("authToken");
    fetch("http://127.0.0.1:5000/api/tables/add", {
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
      }),
    })
      .catch((error) => {
        console.error(error);
      })
      .catch((error) => {
        console.error(error);
      });
  */
  };

  render() {
    return (
      <React.Fragment>
        <DndProvider backend={HTML5Backend}>
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col p-0 m-0">
                <Navigation active={this.state.active} />
              </div>
              <div className="row align-items-start">
                <div className="col-3 p-2 m-4">
                  <label htmlFor="table_name">Tábla neve: </label>
                  <input
                    id="table_name"
                    className="p-0 m-2"
                    type="text"
                    name="table_name"
                    value={this.state.table_name}
                    onChange={this.handleTableNameChange}
                  />
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
                </div>
                <div className="col-3 p-2 m-4">
                  <button
                    className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                    onClick={this.addTable}
                  >
                    + Tábla hozzáadása
                  </button>
                  {this.state.joinSetupRequired && (
                    <button
                      className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                      onClick={this.toggleJoinsPopup}
                    >
                      + Join hozzáadása
                    </button>
                  )}
                </div>
                <div className="col-4 p-2 m-4">
                  <RadioSelect
                    handleRadioSelection={this.selectTableType}
                    options={this.tableOptions}
                  />
                  {this.state.table_type === "dim" && (
                    <RadioSelect
                      handleRadioSelection={this.selectDimType}
                      options={this.dimOptions}
                    />
                  )}
                  {this.state.table_type === "dim" && (
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
              <div className="row align-items-start">
                <div className="col-2 p-2 m-2">
                  {this.state.showColumnTree && (
                    <ColumnTree data={this.state.tables} />
                  )}
                </div>
                <div className="col-7 p-2 m-2">
                  <Canvas addRemoveColumn={this.addRemoveColumn} />
                </div>
                <div className="col-2 p-0 m-0">
                  {this.state.joinSetupRequired && (
                    <div>
                      {this.state.showjoinsPopup && (
                        <JoinSetup
                          columns={this.state.tables}
                          tables={this.state.selected_tables}
                          addJoin={this.addJoin}
                          toggleJoinsPopup={this.toggleJoinsPopup}
                        />
                      )}
                      {this.state.joinsRerender &&
                        this.state.joins.map((join, index) => (
                          <div className="join" key={index}>
                            <Join
                              condition={join.condition}
                              index={index}
                              removeJoin={this.removeJoin}
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DndProvider>
      </React.Fragment>
    );
  }
}

export default TableSetup;
