import React, { Component } from "react";
import RadioSelect from "../common/radioSelect";
import DropDown from "../common/dropDown";
import DateTimePicker from "../common/datePicker";
import Cookies from "js-cookie";
import moment from "moment";

class AddTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table_id: "",
      owner_id: "",
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
    const owner_id = Cookies.get("userid");
    this.setState({ owner_id: owner_id });
  }

  radioOptionsOne = [
    {
      name: "load",
      value: "regular",
      label: "Normál töltés",
      key: "regular",
      id: "0",
    },
    {
      name: "load",
      value: "init",
      label: "Kezdő töltés",
      key: "init",
      id: "1",
    },
  ];

  radioOptionsTwo = [
    {
      name: "sched",
      value: "interval",
      label: "Ismétlődő",
      key: "interval",
      id: "2",
    },
    { name: "sched", value: "date", label: "Egyszeri", key: "date", id: "3" },
  ];

  numbers = Array.from({ length: 15 }, (_, index) => index + 1);

  frequencyOptions = this.numbers.reduce((result, value) => {
    result.push({
      value: value + "",
      key: value + "",
      label: value + "",
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
    const start_date = moment(date).format("YYYY-MM-DD HH:mm");
    this.setState({ start_date: start_date });
  };

  handleEndDateChange = (date) => {
    const end_date = moment(date).format("YYYY-MM-DD HH:mm");
    this.setState({ end_date: end_date });
  };

  handleTableSelection = (selectedValue) => {
    this.setState({ table_id: selectedValue });
  };

  handleFreqSelection = (selectedValue) => {
    console.log(selectedValue);
    this.setState({ task_schedule: selectedValue });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.addTask(
      this.state.table_id,
      this.state.owner_id,
      this.state.load_type,
      this.state.task_trigger,
      this.state.task_schedule,
      this.state.start_date,
      this.state.end_date
    );
  };

  fetchTables = async () => {
    const token = Cookies.get("authToken");
    await fetch("/api/tables", {
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
      <React.Fragment>
        <div className="mt-2 ml-2 container-fluid">
          <div className="row justify-content-start">
            <div className="col">
              <form onSubmit={this.handleSubmit}>
                <DropDown
                  className="dropdown"
                  options={this.state.tables}
                  handleSelection={this.handleTableSelection}
                  display={"Töltendő tábla"}
                />
                <label>Betöltés módja:</label>
                <RadioSelect
                  handleRadioSelection={this.handleOptionChangeOne}
                  options={this.radioOptionsOne}
                />
                <br></br>
                <label>Töltés típusa: </label>
                <RadioSelect
                  handleRadioSelection={this.handleOptionChangeTwo}
                  options={this.radioOptionsTwo}
                />
                <br></br>
                <label>Kezdő dátum: </label>
                <DateTimePicker handleDateChange={this.handleStartDateChange} />
                <br></br>
                {this.state.task_trigger === "interval" && (
                  <div>
                    <label>Vég dátum: </label>
                    <DateTimePicker
                      handleDateChange={this.handleEndDateChange}
                    />
                    <br></br>
                    <div className="d-flex align-items-start m-0 p-0">
                      <label className="mt-2">Gyakoriság (napok): </label>
                      <DropDown
                        options={this.frequencyOptions}
                        handleSelection={this.handleFreqSelection}
                        display={"Napok"}
                      />
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                >
                  Eküld
                </button>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AddTask;
