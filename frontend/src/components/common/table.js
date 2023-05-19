import React, { Component } from "react";
import "../../css/Table.css";

class Table extends Component {
  render() {
    const { data, headers, pretty_names } = this.props;

    return (
      <table className="general-table">
        <thead>
          <tr>
            {pretty_names.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>{row[header]} </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default Table;
