import React, { Component } from "react";
import DropDown from "../common/dropDown";

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item,
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

  componentDidMount() {
    const item = this.props.item;
    this.setState({ item: item }, () => {
      console.log(this.state);
    });
  }

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
        <div className="container m-0 p-0" key={this.props.index}>
          <div className="row m-0 p-0 d-flex align-items-center">
            <button className="deact-button" onClick={this.removeCard}></button>
          </div>
          <div className="row m-0 p-0">
            <div className="col p-0 m-0">
              {this.state.isEditing ? (
                <input
                  className="card-form"
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
            </div>
          </div>
          <div className="row m-0 p-0">
            <div className="col p-0 m-0">
              <DropDown
                options={this.options}
                handleSelection={this.handleSubmit}
                display={"Típus"}
              />
            </div>
          </div>
          <div className="row m-0 p-0">
            <div className="col p-0 m-0">
              <label>Nullable</label>
              <input
                className="card-radio mx-2"
                type="checkbox"
                value={this.state.item.column.key}
                checked={this.state.item.column.nullable}
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
