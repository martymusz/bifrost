import React, { Component } from "react";
import DropDown from "../common/dropDown";
import CustomAlert from "../common/alert";

class AddMetamodel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metamodel_name: "",
      metamodel_schema: "",
      target_connection_id: "0",
      showModal: false,
      message: "",
      messageVariant: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSelection = (selectedValue) => {
    this.setState({ target_connection_id: selectedValue }, () => {});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.addMetamodel(
      this.state.metamodel_name,
      this.state.metamodel_schema,
      parseInt(this.state.target_connection_id)
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="mt-2 ml-2 container-fluid">
          <div className="row justify-content-start">
            <div className="col">
              <div className="form-group">
                <form onSubmit={this.handleSubmit}>
                  <div className="col-sm-6">
                    <label htmlFor="metamodel_name">Metamodell név:</label>
                    <input
                      className="form-control"
                      type="text"
                      id="metamodel_name"
                      name="metamodel_name"
                      value={this.state.metamodel_name}
                      onChange={this.handleInputChange}
                      required
                    />
                  </div>
                  <br></br>
                  <div className="col-sm-6">
                    <label htmlFor="metamodel_schema">Metamodell séma: </label>
                    <input
                      className="form-control"
                      type="text"
                      id="metamodel_schema"
                      name="metamodel_schema"
                      value={this.state.metamodel_schema}
                      onChange={this.handleInputChange}
                      required
                    />
                  </div>
                  <br></br>
                  <div className="col-sm-6">
                    <DropDown
                      options={this.props.connections}
                      handleSelection={this.handleSelection}
                      display={"Kapcsolat"}
                      className="dropdown"
                    />
                  </div>
                  <br></br>
                  <br></br>
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
          <div className="row">
            <div className="col">
              {this.state.showModal && (
                <CustomAlert
                  message={this.state.message}
                  variant={this.state.messageVariant}
                  handleCloseModal={this.props.toggleModal}
                />
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AddMetamodel;
