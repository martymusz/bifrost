import React, { Component } from "react";
import Navigation from "../components/common/navigation";
import Cookies from "js-cookie";
import Table from "../components/common/table";
import AddTask from "../components/addTask";

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      tasks: [],
      showModal: false,
      tables: [],
    };

    this.fetchTasks = this.fetchTasks.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.addTask = this.addTask.bind(this);
  }

  headers = [
    "task_id",
    "table_id",
    "load_type",
    "status",
    "task_trigger",
    "last_run",
  ];

  pretty_names = [
    "Task ID",
    "Table ID",
    "Load Type",
    "Status",
    "Run Type",
    "Last Run",
  ];

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      this.setState({ authenticated: true });
      this.fetchTasks();
    }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };

  fetchTasks = async () => {
    const token = Cookies.get("authToken");
    await fetch("http://127.0.0.1:5000/api/tasks", {
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
    load_type,
    task_trigger,
    task_schedule,
    start_date,
    end_date
  ) => {
    const token = Cookies.get("authToken");
    fetch("http://127.0.0.1:5000/api/tasks/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_id: table_id,
        load_type: load_type,
        task_trigger: task_trigger,
        task_schedule: task_schedule,
        start_date: start_date,
        end_date: end_date,
      }),
    })
      .catch((error) => {
        console.error(error);
      })
      .then(this.fetchTasks)
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <div>
        {this.state.authenticated ? (
          <React.Fragment>
            <Navigation />
            <button className="add-button" onClick={this.toggleModal}>
              + Add Task
            </button>
            {this.state.showModal && (
              <AddTask addTask={this.addTask} toggleModal={this.toggleModal} />
            )}
            <Table
              headers={this.headers}
              data={this.state.tasks}
              pretty_names={this.pretty_names}
            />
          </React.Fragment>
        ) : (
          <div>
            <h1>Access Denied!</h1>
          </div>
        )}
      </div>
    );
  }
}

export default Tasks;
