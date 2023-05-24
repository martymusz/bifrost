import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";

class CustomTable extends Component {
  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            {this.props.pretty_names.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.props.data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                <div className="container d-flex m-1">
                  <Button
                    id={rowIndex}
                    variant="danger"
                    className="mx-1 trash-button"
                    onClick={() => this.props.onDelete(row)}
                  >
                    <AiFillDelete id={rowIndex} />
                  </Button>
                  {this.props.showEditButton && (
                    <Button
                      value={rowIndex}
                      className="mx-1 edit-button"
                      onClick={() => this.props.onModify(row)}
                    >
                      <AiOutlineEdit value={rowIndex} />
                    </Button>
                  )}
                </div>
              </td>
              {this.props.headers.map((column) => (
                <td key={column}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export default CustomTable;
