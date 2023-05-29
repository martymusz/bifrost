import React, { Component } from "react";
import Cookies from "js-cookie";
import Navigation from "../components/common/navigation";
import CustomTable from "../components/common/customTable";
import CustomAlert from "../components/common/alert";
import ChangeName from "../components/home/changeName";
import ChangePsw from "../components/home/changePsw";
import ProfileTable from "../components/home/profile";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      name: "",
      role: "",
      email: "",
      userid: "",
      active: 1,
      tasks: [],
      showEditModalName: false,
      showEditModalPsw: false,
      showAlert: false,
      message: "",
      messageVariant: "",
    };
  }

  headers = [
    "owner_id",
    "task_id",
    "table_id",
    "load_type",
    "status",
    "start_date",
    "last_run",
  ];

  pretty_names = [
    "Tulajdonos",
    "Feladat ID",
    "Tábla ID",
    "Töltés típusa",
    "Státusz",
    "Kezdés ideje",
    "Utolsó futás ideje",
  ];

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    const name = Cookies.get("name");
    const role = Cookies.get("role");
    const email = Cookies.get("email");
    const userid = Cookies.get("userid");
    if (authToken) {
      this.setState(
        {
          authenticated: true,
          name: name,
          role: role,
          email: email,
          userid: userid,
        },
        () => {
          this.fetchTasks();
        }
      );
    } else {
      this.setState({ authenticated: false });
    }
  }

  openPswModal = () => {
    this.setState({ showEditModalPsw: true });
  };

  openNameModal = () => {
    this.setState({ showEditModalName: true });
  };

  closeModal = () => {
    this.setState({ showEditModalPsw: false, showEditModalName: false });
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
        const tasksFiltered = data.filter(
          (task) => task.owner_id.toString() === this.state.userid
        );
        const updatedTasks = tasksFiltered.map((task) => ({
          ...task,
          owner_id: this.state.name,
        }));

        this.setState({ tasks: updatedTasks });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleSubmit = (change, value) => {
    this.closeModal();
    if (change === "password") {
      this.modifyUserPsw(this.state.userid, value);
    } else {
      this.modifyUserName(this.state.userid, value);
      this.setState({ name: value });
      Cookies.set("name", value);
    }
  };

  modifyUserName = (userid, name) => {
    const token = Cookies.get("authToken");
    fetch(`/api/user/${userid}/name`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.setState({
            message: "Felhasználó sikeresen módosítva!",
            messageVariant: "success",
            showAlert: true,
          });
        } else {
          this.setState({
            message: "Hiba! Felhasználót nem sikerült módosítani!",
            messageVariant: "danger",
            showAlert: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  modifyUserPsw = (userid, password) => {
    const token = Cookies.get("authToken");
    fetch(`/api/user/${userid}/password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          this.setState({
            message: "Felhasználó jelszó sikeresen módosítva!",
            messageVariant: "success",
            showAlert: true,
          });
        } else {
          this.setState({
            message: "Hiba! Felhasználó jelszavát nem sikerült módosítani!",
            messageVariant: "danger",
            showAlert: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div>
          {this.state.showEditModalName && (
            <ChangeName
              closeModal={this.closeModal}
              handleSubmit={this.handleSubmit}
            />
          )}
          {this.state.showEditModalPsw && (
            <ChangePsw
              closeModal={this.closeModal}
              handleSubmit={this.handleSubmit}
            />
          )}
        </div>
        {this.state.authenticated ? (
          <div className="container-fluid" data-testid="home">
            <div className="row align-items-center">
              <div className="col p-0 m-0">
                <Navigation active={this.state.active} />
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col p-2 m-4">
                <h2>Üdv, {this.state.name}!</h2>
              </div>
            </div>
            {this.state.showAlert && (
              <div className="row align-items-center">
                <div className="col mx-5 my-0">
                  <CustomAlert
                    message={this.state.message}
                    variant={this.state.messageVariant}
                    handleCloseModal={this.handleCloseAlert}
                  />
                </div>
              </div>
            )}
            <div className="row align-items-center">
              <div className="col p-2 mx-5 my-0">
                <h2>Profilod:</h2>
                <br></br>
                <button
                  className="mb-3 mx-2 btn btn-primary d-none d-md-block coral"
                  onClick={this.openPswModal}
                >
                  Jelszó megváltoztatása
                </button>
                <br></br>
                <ProfileTable
                  name={this.state.name}
                  email={this.state.email}
                  role={this.state.role}
                  openNameModal={this.openNameModal}
                />
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col p-2 mx-5 my-2">
                <h2>Ütemezett tábla töltéseid:</h2>
                <br></br>
                <CustomTable
                  headers={this.headers}
                  data={this.state.tasks}
                  pretty_names={this.pretty_names}
                  onDelete={this.deleteTask}
                  onModify={this.openEditModal}
                  showEditButton={false}
                  showDeleteButton={false}
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

export default Home;
