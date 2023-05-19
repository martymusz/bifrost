import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../../css/Navigation.css";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
      tabs: [
        { id: 0, value: "Logout" },
        { id: 1, value: "Home" },
        { id: 2, value: "Connections" },
        { id: 3, value: "Metamodels" },
        { id: 4, value: "Tables" },
        { id: 5, value: "Tasks" },
        { id: 6, value: "User Admin" },
      ],
    };
    this.navigateToPage = this.navigateToPage.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    const role = Cookies.get("role");
    this.setState({ role: role });
  }

  handleLogout() {
    Cookies.remove("authToken");
  }

  navigateToPage(menuItem) {
    const navigate = this.props.navigate;
    if (menuItem === 0) {
      this.handleLogout();
      navigate("/");
    } else if (menuItem === 1) {
      navigate("/home");
    } else if (menuItem === 2) {
      navigate("/connections");
    } else if (menuItem === 3) {
      navigate("/metamodels");
    } else if (menuItem === 4) {
      navigate("/tables");
    } else if (menuItem === 5) {
      navigate("/tasks");
    } else if (menuItem === 6) {
      navigate("/users");
    } else {
      console.log(menuItem);
    }
  }

  render() {
    return (
      <div className="navigation">
        {this.state.tabs.map((tab) =>
          this.state.role === 1 || (this.state.role !== 1 && tab.id !== 6) ? (
            <li
              className={tab.id === 0 ? "navigation-right" : "navigation-left"}
              key={tab.id}
              onClick={() => this.navigateToPage(tab.id)}
            >
              {tab.value}
            </li>
          ) : (
            <div></div>
          )
        )}
      </div>
    );
  }
}

export default function Wrapper() {
  const navigate = useNavigate();
  return <Navigation navigate={navigate} />;
}
