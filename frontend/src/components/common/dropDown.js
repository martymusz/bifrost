import React, { Component } from "react";
import "../../css/DropDown.css";

class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: "",
    };
  }

  handleSelectionChange = (event) => {
    event.preventDefault();
    const selectedValue = event.target.value;
    this.setState({ selectedValue: selectedValue });
    this.props.handleSelection(selectedValue);
  };

  render() {
    return (
      <div>
        <select
          className="dropdown"
          value={this.state.selectedValue}
          onChange={this.handleSelectionChange}
        >
          {this.props.options.map((option) => (
            <option key={option.key} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default DropDown;
