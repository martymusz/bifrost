import React, { Component } from "react";

class PopupFormMetamodel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metamodel_id: "",
      metamodel_name: "",
    };
  }

  componentDidMount() {
    this.setState({
      metamodel_id: this.props.row.metamodel_id,
      metamodel_name: this.props.row.metamodel_name,
    });
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.modifyMetamodel(
      this.state.metamodel_id,
      this.state.metamodel_name
    );
    this.props.closeEditModal();
  };

  render() {
    return (
      <React.Fragment>
        <div className="modal-background">
          <div className="d-flex justify-content-center align-items-center">
            <div className="popup-form-group mx-0">
              <form onSubmit={this.handleSubmit}>
                <label htmlFor="metamodel_name">Metamodell név: </label>
                <input
                  className="form-control"
                  name="metamodel_name"
                  type="text"
                  id="metamodel_name"
                  placeholder="Metamodell név"
                  value={this.state.metamodel_name}
                  onChange={this.handleInputChange}
                  required
                />
                <br></br>
                <div className="container d-flex">
                  <button
                    type="submit"
                    className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                  >
                    Módosít
                  </button>
                  <button
                    onClick={this.props.closeEditModal}
                    className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                  >
                    Mégse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PopupFormMetamodel;
