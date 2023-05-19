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
        <table className="radioselect">
          <tbody>
            <tr>
              {this.props.options.map((option) => (
                <td key={option.key}>
                  <input
                    type="radio"
                    name={option.name}
                    value={option.value}
                    id={option.key}
                    key={option.key}
                    checked={this.state.selectedValue === option.value}
                    onChange={this.handleChange}
                  />
                  <label htmlFor={option.label}>{option.label}</label>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}
export default RadioSelect;

//
