import React, { Component } from "react";
import DropDown from "../common/dropDown";

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      column: "",
      isEditing: false,
    };
  }

  options = [
    { value: "Integer", label: "Integer", key: 1 },
    { value: "String", label: "String", key: 2 },
    { value: "Date", label: "Date", key: 3 },
  ];

  componentDidMount() {
    const column = this.props.column;
    this.setState({ column: column });
  }

  handleEditClick = () => {
    this.setState({ isEditing: true });
  };

  handleSaveClick = () => {
    this.setState({ isEditing: false });
    const key = this.props.column.key;
    this.props.updateCard(key, this.state.column);
  };

  handleNameChange = (event) => {
    const name = event.target.value;
    this.setState((prevState) => ({
      column: { ...prevState.column, column_name: name },
    }));
  };

  handleSubmit = (selectedValue) => {
    const key = this.props.column.key;
    const datatype =
      selectedValue === 1 ? "Integer" : selectedValue === 2 ? "String" : "Date";
    this.setState(
      (prevState) => ({
        column: { ...prevState.column, column_type: datatype },
      }),
      () => {
        this.props.updateCard(key, this.state.column);
      }
    );
  };

  handleCheckboxChange = (event) => {
    const key = this.props.column.key;
    const nullable = event.target.checked;
    this.setState(
      (prevState) => ({
        column: { ...prevState.column, nullable: nullable },
      }),
      () => {
        this.props.updateCard(key, this.state.column);
      }
    );
  };

  removeCard = () => {
    const key = this.props.column.key;
    this.props.removeCard(key);
  };

  render() {
    return (
      <React.Fragment>
        <div className="container m-0 p-0" key={this.props.id}>
          <div className="row m-0 p-0 d-flex justify-content-center">
            <div className="col p-0 m-0 d-flex justify-content-center">
              <button
                className="deact-button"
                onClick={this.removeCard}
              ></button>
            </div>
          </div>
          <div className="row m-0 p-0 d-flex justify-content-center">
            <div className="col p-0 m-0 d-flex justify-content-center">
              {this.state.isEditing ? (
                <input
                  className="card-form"
                  type="text"
                  name="column"
                  value={this.state.column.column_name}
                  onChange={this.handleNameChange}
                  onBlur={this.handleSaveClick}
                  autoFocus
                />
              ) : (
                <div onClick={this.handleEditClick}>
                  {this.state.column.column_name}
                </div>
              )}
            </div>
          </div>
          <div className="row m-0 p-0 d-flex justify-content-center">
            <div className="col p-0 m-0 d-flex justify-content-center">
              <DropDown
                options={this.options}
                handleSelection={this.handleSubmit}
                display={"Típus"}
              />
            </div>
          </div>
          <div className="row m-0 p-0 d-flex justify-content-center">
            <div className="col p-0 m-0 d-flex justify-content-center">
              <label>Nullable</label>
              <input
                className="card-radio mx-2"
                type="checkbox"
                onChange={this.handleCheckboxChange}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Card;
