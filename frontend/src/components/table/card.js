import React, { Component } from "react";
import DropDown from "../common/dropDown";

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.column,
      isEditing: false,
    };

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeCard = this.removeCard.bind(this);
  }

  options = [
    { value: "Integer", label: "Integer", key: 1 },
    { value: "String", label: "String", key: 2 },
    { value: "Date", label: "Date", key: 3 },
  ];

  handleEditClick = () => {
    this.setState({ isEditing: true });
  };

  handleSaveClick = () => {
    this.setState({ isEditing: false });
    const key = this.state.item.column.key;
    this.props.updateCard(key, this.state.item);
  };

  handleInputChange = (event) => {
    const name = event.target.value;
    console.log(event.target);
    this.setState((prevState) => ({
      item: {
        column: { ...prevState.item.column, column: name },
      },
    }));
  };

  handleSubmit = (selectedValue) => {
    const key = this.state.item.column.key;
    const datatype = selectedValue;
    this.setState(
      (prevState) => ({
        item: {
          column: { ...prevState.item.column, datatype: datatype },
        },
      }),
      () => {
        this.props.updateCard(key, this.state.item);
      }
    );
  };

  handleCheckboxChange = (event) => {
    const key = this.state.item.column.key;
    const nullable = event.target.checked;
    this.setState(
      (prevState) => ({
        item: { column: { ...prevState.item.column, nullable: nullable } },
      }),
      () => {
        this.props.updateCard(key, this.state.item);
      }
    );
  };

  removeCard = () => {
    const key = this.state.item.column.key;
    this.props.removeCard(key);
  };

  render() {
    return (
      <React.Fragment>
        <table className="card">
          <tbody>
            <tr>
              <td>
                <button
                  className="deact-button"
                  onClick={this.removeCard}
                ></button>
              </td>
            </tr>
            <tr>
              <td>
                {this.state.isEditing ? (
                  <input
                    type="text"
                    name="column"
                    value={this.state.item.column.column}
                    onChange={this.handleInputChange}
                    onBlur={this.handleSaveClick}
                    autoFocus
                  />
                ) : (
                  <div onClick={this.handleEditClick}>
                    {this.state.item.column.column}
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <div className="card-inner">
                  <DropDown
                    options={this.options}
                    handleSelection={this.handleSubmit}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="card-radio">
                  <label>Nullable</label>
                  <input
                    className="card-radio"
                    type="checkbox"
                    value={this.state.item.column.key}
                    checked={this.state.item.column.nullable}
                    onChange={this.handleCheckboxChange}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default Card;
