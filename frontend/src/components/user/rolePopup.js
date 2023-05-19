import React, { Component } from "react";
import RadioSelect from "../common/radioSelect";

class RolePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRole: 0,
    };

    this.handleRoleChange = this.handleRoleChange.bind(this);
  }

  radioOptions = [
    { name: "roles", value: "1", label: "Administrator", key: 1 },
    { name: "roles", value: "2", label: "Data Modeler", key: 2 },
    { name: "roles", value: "3", label: "Analyst", key: 3 },
  ];

  handleRoleChange = (event) => {
    this.setState({ selectedRole: parseInt(event) }, () => {
      this.props.changeRole(this.props.userid, this.state.selectedRole);
      this.props.toggleRolePopup();
    });
  };

  render() {
    return (
      <div className="overlay">
        <div className="popup">
          <table>
            <tbody>
              <tr>
                <td>
                  <h4>Please select role:</h4>
                </td>
              </tr>
              <tr>
                <td>
                  <RadioSelect
                    handleRadioSelection={this.handleRoleChange}
                    options={this.radioOptions}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
export default RolePopup;
