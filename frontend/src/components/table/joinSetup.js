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
    //check h nem ugyanaz a tábla és hogy minden ki van-e töltve!
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
        <div className="overlay">
          <div className="popup2">
            <table>
              <tbody>
                <tr>
                  <td>
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <Dropdown
                              options={this.state.columns}
                              onChange={this.selectFirstJoinColumn}
                              placeholder="Select column for join"
                              className="dropdown"
                            />
                          </td>
                          <td>
                            <Dropdown
                              options={["=", "<", ">", "=>", "=<"]}
                              onChange={this.selectOperation}
                              placeholder="Select operation"
                              className="dropdown"
                            />
                          </td>
                          <td>
                            <Dropdown
                              options={this.state.columns}
                              onChange={this.selectSecondJoinColumn}
                              placeholder="Select column for join"
                              className="dropdown"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>
                      <RadioSelect
                        handleRadioSelection={this.handleOptionChange}
                        options={this.radioOptions}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="button-box" onClick={this.handleAddJoin}>
                      <div className="add-button-blue">
                        <span>ADD JOIN</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default JoinSetup;
