import React, { Component } from "react";
import Cookies from "js-cookie";
import Navigation from "../components/common/navigation";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      user: "",
      role: "",
    };
  }

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    const user = Cookies.get("user");
    const role = Cookies.get("role");
    if (authToken) {
      this.setState({ authenticated: true, user: user, role: role });
    } else {
      this.setState({ authenticated: false });
    }
  }

  render() {
    return (
      <div>
        {this.state.authenticated ? (
          <React.Fragment>
            <Navigation />
            <div>
              <h2>Welcome {this.state.user}!</h2>
            </div>
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

export default Home;
