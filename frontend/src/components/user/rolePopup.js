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
    { name: "roles", value: "1", label: "Adminisztrátor", key: 1 },
    { name: "roles", value: "2", label: "Adatmodellező", key: 2 },
    { name: "roles", value: "3", label: "Elemző", key: 3 },
  ];

  handleRoleChange = (event) => {
    this.setState({ selectedRole: parseInt(event) }, () => {
      this.props.changeRole(this.props.userid, this.state.selectedRole);
      this.props.toggleRolePopup();
    });
  };

  render() {
    return (
      <div className="modal-background">
        <div className="d-flex justify-content-center align-items-center">
          <div className="popup-form-group mx-0">
            <table>
              <tbody>
                <tr>
                  <td>
                    <h4>Kérlek, válassz új szerepkört!</h4>
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
      </div>
    );
  }
}
export default RolePopup;
