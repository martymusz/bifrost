import React, { Component } from "react";

class RadioSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event) => {
    this.setState({ selectedValue: event.target.value });
    this.props.handleRadioSelection(event.target.value);
  };

  render() {
    return (
      <React.Fragment>
        <div className="radio-select">
          {this.props.options.map((option, index) => (
            <div className="form-check-inline" key={index}>
              <input
                className="form-check-input mx-2 py-2"
                type="radio"
                id={option.id}
                value={option.value}
                checked={this.state.selectedValue === option.value}
                onChange={this.handleChange}
              />
              <label className="form-check-label" htmlFor={option.id}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}
export default RadioSelect;
