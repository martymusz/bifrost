import React, { Component } from "react";
import Navigation from "../components/common/navigation";
import Cookies from "js-cookie";
import CustomTable from "../components/common/customTable";
import CustomAlert from "../components/common/alert";
import AddTask from "../components/tasks/addTask";

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      tasks: [],
      tables: [],
      active: 5,
      showModal: false,
      showAlert: false,
      showEditModal: false,
      userid: "",
    };

    this.fetchTasks = this.fetchTasks.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.addTask = this.addTask.bind(this);
  }

  headers = [
    "owner_name",
    "task_id",
    "table_name",
    "load_type",
    "status",
    "start_date",
    "last_run",
  ];

  pretty_names = [
    "Műveletek",
    "Tulajdonos",
    "Töltés ID",
    "Tábla ID",
    "Töltés típusa",
    "Státusz",
    "Kezdés ideje",
    "Utolsó futás ideje",
  ];

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    const userid = Cookies.get("userid");
    if (authToken) {
      this.setState({ authenticated: true, userid: userid });
      this.fetchTasks();
    }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };

  openEditModal = (row) => {
    this.setState((prevState) => ({
      showEditModal: !prevState.showEditModal,
      rowForEdit: row,
    }));
  };

  closeEditModal = () => {
    this.setState((prevState) => ({
      showEditModal: !prevState.showEditModal,
    }));
  };

  fetchTasks = async () => {
    const token = Cookies.get("authToken");
    await fetch("/api/tasks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then(async (response) => await response.json())
      .then((data) => {
        this.setState({ tasks: data });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  addTask = (
    table_id,
    owner_id,
    load_type,
    task_trigger,
    task_schedule,
    start_date,
    end_date
  ) => {
    const token = Cookies.get("authToken");
    fetch("/api/tasks/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_id: table_id,
        owner_id: owner_id,
        load_type: load_type,
        task_trigger: task_trigger,
        task_schedule: task_schedule,
        start_date: start_date,
        end_date: end_date,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.toggleModal();
          this.setState(
            {
              message: "Töltés hozzáadása sikeres!",
              messageVariant: "success",
              showAlert: true,
            },
            () => {
              this.fetchTasks();
            }
          );
        } else {
          this.setState({
            message: "Hiba! A töltés hozzáadása nem sikerült!",
            messageVariant: "danger",
            showAlert: true,
          });
        }
      })
      .catch((error) => {
        console.error("Request failed:", error);
      });
  };

  deleteTask = (row) => {
    const task_id = row.task_id;
    const token = Cookies.get("authToken");
    fetch(`/api/task/${task_id}/remove`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_id: task_id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.setState(
            {
              message: "Töltés törlése sikeres!",
              messageVariant: "success",
              showAlert: true,
            },
            () => {
              this.fetchTasks();
            }
          );
        } else {
          this.setState({
            message: "Hiba! A töltés törlése nem sikerült!",
            messageVariant: "danger",
            showAlert: true,
          });
        }
      })
      .catch((error) => {
        console.error("Request failed:", error);
      });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.authenticated ? (
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col p-0 m-0">
                <Navigation active={this.state.active} />
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col p-2">
                {this.state.role !== "3" && (
                  <button
                    className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                    onClick={this.toggleModal}
                  >
                    + Új töltés
                  </button>
                )}
              </div>
            </div>
            <div className="row align-items-left">
              <div className="col">
                {this.state.showModal && (
                  <AddTask
                    toggleModal={this.toggleModal}
                    addTask={this.addTask}
                  />
                )}
              </div>
            </div>
            <div className="row align-items-left">
              <div className="col">
                {this.state.showAlert && (
                  <CustomAlert
                    message={this.state.message}
                    variant={this.state.messageVariant}
                    handleCloseModal={this.handleCloseAlert}
                  />
                )}
              </div>
            </div>
            <div className="row align-items-left">
              <div className="col">
                <CustomTable
                  headers={this.headers}
                  data={this.state.tasks}
                  pretty_names={this.pretty_names}
                  onDelete={this.deleteTask}
                  onModify={this.openEditModal}
                  showEditButton={false}
                  showDeleteButton={true}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1>Access Denied!</h1>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Tasks;
