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

  handleDateChange = (date) => {
    this.props.handleDateChange(date);
  };

  render() {
    return (
      <div>
        <DatePicker
          selected={this.state.selectedDate}
          onChange={this.handleDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy-MM-dd HH:ss"
          placeholderText="Kérlek válassz dátumot!"
        />
      </div>
    );
  }
}

export default DateTimePicker;
