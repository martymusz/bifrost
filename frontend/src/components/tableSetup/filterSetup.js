import React, { Component } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

class FilterSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      tables: [],
      column_name: "",
      operation: "",
      filter_value: "",
    };
  }

  componentDidMount() {
    const columnsFiltered = this.props.columns.filter((column) =>
      this.props.tables.includes(column.table_name)
    );

    const options = columnsFiltered.reduce((acc, item) => {
      const group = acc.find((group) => group.name === item.table_name);
      if (group) {
        group.items.push({ value: item.key, label: item.column_name });
      } else {
        acc.push({
          type: "group",
          name: item.table_name,
          items: [{ value: item.key, label: item.column_name }],
        });
      }
      return acc;
    }, []);
    this.setState({ columns: options });
  }

  selectFilter = (item) => {
    const key = item.value;
    const column_name = key.substring(0, key.indexOf("_"));
    this.setState({ column_name: column_name });
  };

  selectOperation = (item) => {
    const operation = item.value;
    this.setState({ operation: operation });
  };

  handleValueChange = (event) => {
    const filter_value = event.target.value;
    this.setState({ filter_value: filter_value });
  };

  handleAddFilter = () => {
    const condition = {
      condition:
        this.state.column_name + this.state.operation + this.state.filter_value,
    };
    this.props.addFilter(condition);
  };

  render() {
    return (
      <React.Fragment>
        <div className="modal-background">
          <div className="d-flex justify-content-center align-items-center">
            <div className="popup-form-group mx-0">
              <div className="row">
                <div className="col m-2 mt-3">
                  <Dropdown
                    options={this.state.columns}
                    onChange={this.selectFilter}
                    placeholder="Oszlop"
                  />
                </div>
                <div className="col m-2 mt-3">
                  <Dropdown
                    options={["=", "<", ">", "=>", "=<"]}
                    onChange={this.selectOperation}
                    placeholder="Művelet"
                  />
                </div>
                <div className="col m-0">
                  <label htmlFor="filter_value">Érték: </label>
                  <input
                    id="filter_value"
                    className="p-0 m-0"
                    type="text"
                    name="filter_value"
                    value={this.state.filter_value}
                    onChange={this.handleValueChange}
                  />
                </div>
                <div className="row">
                  <div className="col m-0 p-0">
                    <div className="d-flex justify-content-center mt-5 p-0">
                      <button
                        onClick={this.handleAddFilter}
                        className="mb-3 mx-2 btn btn-primary d-none d-md-block
                      coral"
                      >
                        Hozzáad
                      </button>
                      <button
                        onClick={this.props.toggleFiltersPopup}
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
        </div>
      </React.Fragment>
    );
  }
}

export default FilterSetup;
