import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class DateTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: null,
    };
  }

  handleDateChange = (selectedDate) => {
    this.setState({ selectedDate: selectedDate });
    this.props.handleDateChange(selectedDate);
  };

  render() {
    return (
      <div>
        <DatePicker
          selected={this.state.selectedDate}
          onChange={this.handleDateChange}
          dateFormat="Pp"
          showTimeSelect
          timeFormat="p"
          timeIntervals={10}
          placeholderText="Kérlek válassz dátumot!"
        />
      </div>
    );
  }
}

export default DateTimePicker;
