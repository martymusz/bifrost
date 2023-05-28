import React, { Component } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import RadioSelect from "../common/radioSelect";

class JoinSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      tables: [],
      table_name: "",
      key: "",
      joined_table: "",
      joined_key: "",
      join_type: "",
      operation: "",
    };

    this.selectFirstJoinColumn = this.selectFirstJoinColumn.bind(this);
    this.selectSecondJoinColumn = this.selectSecondJoinColumn.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleAddJoin = this.handleAddJoin.bind(this);
  }

  radioOptions = [
    { name: "join", value: "1", label: "Inner join", key: 1 },
    { name: "join", value: "2", label: "Left join", key: 2 },
    { name: "join", value: "3", label: "Right join", key: 3 },
  ];

  componentDidMount() {
    const columnsFiltered = this.props.columns.filter((column) =>
      this.props.tables.includes(column.table_name)
    );

    const options = columnsFiltered.reduce((acc, item) => {
      const group = acc.find((group) => group.name === item.table_name);
      if (group) {
        group.items.push({ value: item.key, label: item.column });
      } else {
        acc.push({
          type: "group",
          name: item.table_name,
          items: [{ value: item.key, label: item.column }],
        });
      }
      return acc;
    }, []);
    this.setState({ columns: options });
  }

  selectFirstJoinColumn = (item) => {
    const key = item.value;
    const table = key.substring(0, key.indexOf("_"));
    this.setState({ table_name: table, key: key });
  };

  selectSecondJoinColumn = (item) => {
    const joined_key = item.value;
    const joined_table = joined_key.substring(0, joined_key.indexOf("_"));
    this.setState({ joined_table: joined_table, joined_key: joined_key });
  };

  selectOperation = (item) => {
    const operation = item.value;
    this.setState({ operation: operation });
  };

  handleOptionChange = (selectedValue) => {
    const join_type = selectedValue;
    this.setState({ join_type: join_type });
  };

  handleAddJoin = () => {
    const join = {
      table_name: this.state.table_name,
      joined_table: this.state.joined_table,
      condition: this.state.key + this.state.operation + this.state.joined_key,
      join_type: this.state.join_type,
    };
    this.props.addJoin(join);
  };

  render() {
    return (
      <React.Fragment>
        <div className="modal-background">
          <div className="d-flex justify-content-center align-items-center">
            <div className="popup-form-group mx-0">
              <div className="row">
                <div className="col m-2">
                  <Dropdown
                    options={this.state.columns}
                    onChange={this.selectFirstJoinColumn}
                    placeholder="Oszlop"
                  />
                </div>
                <div className="col m-2">
                  <Dropdown
                    options={["=", "<", ">", "=>", "=<"]}
                    onChange={this.selectOperation}
                    placeholder="Művelet"
                  />
                </div>
                <div className="col m-2">
                  <Dropdown
                    options={this.state.columns}
                    onChange={this.selectSecondJoinColumn}
                    placeholder="Oszlop"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col m-2 d-flex justify-content-center">
                  <RadioSelect
                    handleRadioSelection={this.handleOptionChange}
                    options={this.radioOptions}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col m-0 p-0">
                  <div className="d-flex justify-content-center m-0 p-0">
                    <button
                      onClick={this.handleAddJoin}
                      className="mb-3 mx-2 btn btn-primary d-none d-md-block
                      coral"
                    >
                      Hozzáad
                    </button>
                    <button
                      onClick={this.props.toggleJoinsPopup}
                      className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                    >
                      Mégse
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default JoinSetup;
