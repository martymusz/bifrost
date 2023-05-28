import React, { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "",
      role: "",
      tabs_admin: [
        { id: 1, value: "Főoldal", link: "/home" },
        { id: 2, value: "Kapcsolatok", link: "/connections" },
        { id: 3, value: "Metamodellek", link: "/metamodels" },
        { id: 4, value: "Adattáblák", link: "/tables" },
        { id: 5, value: "Töltések", link: "/tasks" },
        { id: 6, value: "Felhasználók", link: "/users" },
      ],

      tabs: [
        { id: 1, value: "Főoldal", link: "/home" },
        { id: 2, value: "Kapcsolatok", link: "/connections" },
        { id: 3, value: "Metamodellek", link: "/metamodels" },
        { id: 4, value: "Adattáblák", link: "/tables" },
        { id: 5, value: "Töltések", link: "/tasks" },
      ],
    };
  }

  componentDidMount() {
    const active = this.props.active;
    const role = Cookies.get("role");
    this.setState({ role: role, active: active });
  }

  render() {
    const tabs =
      this.state.role === "1" ? this.state.tabs_admin : this.state.tabs;

    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg p-0">
          <ul className="navbar-nav p-0">
            {tabs.map((tab, index) => (
              <li
                className={`nav-item mx-2${
                  tab.id === this.state.active ? " active" : ""
                }`}
                key={index}
              >
                <Link
                  to={tab.link}
                  className={`nav-link mx-2${
                    tab.id === this.state.active ? " active" : ""
                  }`}
                >
                  {tab.value}
                </Link>
              </li>
            ))}
            <Link to="/" className="nav-link mx-2">
              Kijelentkezés
            </Link>
          </ul>
        </nav>
      </React.Fragment>
    );
  }
}

export default Navigation;
