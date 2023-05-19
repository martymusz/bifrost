import React, { Component } from "react";
import RadioSelect from "./common/radioSelect";
import DropDown from "./common/dropDown";
import DateTimePicker from "./common/datePicker";
import Cookies from "js-cookie";
import "../css/AddModal.css";

class AddTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table_id: "",
      load_type: "",
      task_trigger: "",
      task_schedule: 0,
      start_date: "",
      end_date: "",
      tables: [],
    };

    this.handleOptionChangeOne = this.handleOptionChangeOne.bind(this);
    this.handleOptionChangeTwo = this.handleOptionChangeTwo.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleTableSelection = this.handleTableSelection.bind(this);
    this.handleFreqSelection = this.handleFreqSelection.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchTables();
  }

  radioOptionsOne = [
    { name: "load", value: "regular", label: "Regular", key: "regular" },
    { name: "load", value: "init", label: "Init load", key: "init" },
  ];

  radioOptionsTwo = [
    {
      name: "sched",
      value: "interval",
      label: "Scheduled",
      key: "interval",
    },
    { name: "sched", value: "date", label: "Ad-hoc", key: "date" },
  ];

  numbers = Array.from({ length: 15 }, (_, index) => index + 1);

  frequencyOptions = this.numbers.reduce((result, value) => {
    result.push({
      value: value,
      key: value,
      label: value,
    });
    return result;
  }, []);

  handleOptionChangeOne = (selectedValue) => {
    this.setState({ load_type: selectedValue });
  };

  handleOptionChangeTwo = (selectedValue) => {
    this.setState({ task_trigger: selectedValue });
  };

  handleStartDateChange = (date) => {
    const moment = require("moment");
    const start_date = moment(date).format("YYYY-MM-DD HH:mm");
    this.setState({ start_date: start_date });
  };

  handleEndDateChange = (date) => {
    const moment = require("moment");
    const end_date = moment(date).format("YYYY-MM-DD HH:mm");
    this.setState({ end_date: end_date });
  };

  handleTableSelection = (selectedValue) => {
    this.setState({ table_id: selectedValue });
  };

  handleFreqSelection = (selectedValue) => {
    this.setState({ task_schedule: selectedValue });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
    this.props.addTask(
      this.state.table_id,
      this.state.load_type,
      this.state.task_trigger,
      this.state.task_schedule,
      this.state.start_date,
      this.state.end_date
    );
  };

  fetchTables = async () => {
    const token = Cookies.get("authToken");
    await fetch("http://127.0.0.1:5000/api/tables", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then(async (response) => await response.json())
      .then((data) => {
        const tables = data.map((item) => ({
          value: item.table_id,
          label: item.table_name,
          key: item.table_id,
        }));
        this.setState({ tables: tables });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <div className="add-modal">
        <form onSubmit={this.handleSubmit}>
          <table className="task-modal-table">
            <tbody>
              <tr>
                <td>Table:</td>
                <td>
                  <div className="task-dropdown">
                    <DropDown
                      options={this.state.tables}
                      handleSelection={this.handleTableSelection}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>Load type: </td>
                <td>
                  <div className="radio-container">
                    <RadioSelect
                      handleRadioSelection={this.handleOptionChangeOne}
                      options={this.radioOptionsOne}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>Run Type: </td>
                <td>
                  <div className="radio-container">
                    <RadioSelect
                      handleRadioSelection={this.handleOptionChangeTwo}
                      options={this.radioOptionsTwo}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>Start Date: </td>
                <td>
                  <div>
                    <DateTimePicker
                      handleDateChange={this.handleStartDateChange}
                    />
                  </div>
                </td>
              </tr>
              {this.state.task_trigger === "interval" ? (
                <>
                  <tr>
                    <td>End Date: </td>
                    <td>
                      <div>
                        <DateTimePicker
                          handleDateChange={this.handleEndDateChange}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Frequency (days): </td>
                    <td>
                      <DropDown
                        options={this.frequencyOptions}
                        handleSelection={this.handleFreqSelection}
                      />
                    </td>
                  </tr>
                </>
              ) : (
                <div></div>
              )}
            </tbody>
          </table>
          <button className="submit-button" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default AddTask;
