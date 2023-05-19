import React, { Component } from "react";
import Navigation from "../components/navigation";
import Cookies from "js-cookie";

class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };

    //this.fetchConnections = this.fetchConnections.bind(this);
  }

  componentDidMount() {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      this.setState({ authenticated: true });
      //this.fetchConnections();
    }
  }

  render() {
    return (
      <div>
        {this.state.authenticated ? (
          <React.Fragment>
            <b>Ez itt a Connections oldal</b>
            <table>
              <thead>
                <tr>
                  <td>
                    <Navigation />
                  </td>
                </tr>
                <td>{JSON.stringify(this.state.data)}</td>
              </thead>
            </table>
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

export default Template;
