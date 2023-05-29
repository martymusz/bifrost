import React, { Component } from "react";
import DropDown from "../common/dropDown";
import RadioSelect from "../common/radioSelect";
import DateTimePicker from "../common/datePicker";
import moment from "moment";

class AddTimeDim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table_name: "",
      metamodel_id: "",
      load_type: "",
      start_date: "",
      end_date: "",
    };
  }

  radioOptions = [
    { name: "load", value: "replace", label: "Kezdő töltés", key: 1 },
    { name: "load", value: "append", label: "Hozzád", key: 2 },
  ];

  selectMetamodel = (selectedValue) => {
    this.setState({ metamodel_id: selectedValue });
  };

  handleOptionChange = (selectedValue) => {
    const load_type = selectedValue;
    this.setState({ load_type: load_type });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleStartDateChange = (date) => {
    const start_date = moment(date).format("YYYY-MM-DD HH:mm");
    this.setState({ start_date: start_date });
  };

  handleEndDateChange = (date) => {
    const end_date = moment(date).format("YYYY-MM-DD HH:mm");
    this.setState({ end_date: end_date });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.addTimeDimension(
      this.state.table_name,
      this.state.metamodel_id,
      this.state.load_type,
      this.state.start_date,
      this.state.end_date
    );
    this.props.toggleTimeDimModal();
  };

  render() {
    return (
      <React.Fragment>
        <div className="modal-background">
          <div className="d-flex justify-content-center">
            <div className="popup-form-group mx-0 justify-content-center">
              <div className="row mx-2 justify-content-center">
                <form onSubmit={this.handleSubmit}>
                  <label htmlFor="table_name">Tábla név: </label>
                  <input
                    className="mb-3 mx-3"
                    name="table_name"
                    type="text"
                    id="table_name"
                    placeholder="Tábla név:"
                    value={this.state.table_name}
                    onChange={this.handleInputChange}
                    required
                  />
                </form>
              </div>
              <div className="row mx-2">
                <DropDown
                  options={this.props.metamodels}
                  handleSelection={this.selectMetamodel}
                  display={"Metamodell"}
                  className="dropdown"
                />
              </div>
              <div className="row mx-3 my-2 justify-content-center">
                <RadioSelect
                  handleRadioSelection={this.handleOptionChange}
                  options={this.radioOptions}
                />
              </div>
              <div className="row mx-2 justify-content-center">
                <label className="p-1">Kezdő dátum: </label>
                <DateTimePicker handleDateChange={this.handleStartDateChange} />
              </div>
              <div className="row mx-2 justify-content-center">
                <label className="p-1">Vég dátum: </label>
                <DateTimePicker handleDateChange={this.handleEndDateChange} />
              </div>
              <div className="container d-flex justify-content-center">
                <button
                  onClick={this.handleSubmit}
                  className="mb-3 mx-4 btn btn-primary d-none d-md-block coral"
                >
                  Hozzáad
                </button>
                <button
                  type="submit"
                  className="mb-3 mx-4 btn btn-primary d-none d-md-block coral"
                  onClick={this.props.toggleTimeDimModal}
                >
                  Mégsem
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AddTimeDim;
