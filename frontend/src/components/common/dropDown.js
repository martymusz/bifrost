import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";

class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: "",
      selectedLabel: "",
    };
  }

  handleSelectionChange = (value) => {
    const selectedLabel = value;
    const selectedItem = this.props.options.find(
      (item) => item.label === selectedLabel
    );
    const selectedValue = selectedItem.key;
    this.setState({
      selectedValue: selectedValue,
      selectedLabel: selectedLabel,
    });
    this.props.handleSelection(selectedValue);
  };

  render() {
    return (
      <Dropdown
        onSelect={this.handleSelectionChange}
        className={this.props.className}
      >
        <Dropdown.Toggle variant="primary cornflowerblue" id="dropdown-basic">
          {this.state.selectedLabel || this.props.display}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {this.props.options.map((option) => (
            <Dropdown.Item key={option.key} eventKey={option.label}>
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
export default DropDown;
