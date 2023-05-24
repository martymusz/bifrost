import React, { Component } from "react";

class RadioSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: "0",
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
          <div className="pl-2"></div>
          {this.props.options.map((option, index) => (
            <div className="form-check-inline" key={index}>
              <input
                className="form-check-input"
                type="radio"
                name="radioSelect"
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

//
