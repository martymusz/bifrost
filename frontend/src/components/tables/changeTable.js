import React, { Component } from "react";

class PopupFormTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table_id: "",
      sql: "",
    };
  }

  componentDidMount() {
    this.setState({
      table_id: this.props.row.table_id,
      sql: this.props.row.sql,
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
    this.props.modifyTable(this.state.table_id, this.state.sql);
    this.props.closeEditModal();
  };

  render() {
    return (
      <React.Fragment>
        <div className="modal-background">
          <div className="modal-dialog-centered modal-dialog-scrollable">
            <div className="form-group mx-0">
              <form onSubmit={this.handleSubmit}>
                <label htmlFor="sql">Lekérdezés: </label>
                <input
                  className="mb-3 mx-3"
                  name="sql"
                  type="text"
                  id="sql"
                  placeholder="Lekérdezés"
                  value={this.state.sql}
                  onChange={this.handleInputChange}
                  required
                />
                <br></br>
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
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PopupFormTable;
