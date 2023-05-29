import React, { Component } from "react";

class Checklist extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-1 p-0 m-2">
              {this.props.check_joins ? (
                <button className="act-button"></button>
              ) : (
                <button className="deact-button"></button>
              )}
            </div>
            <div className="col-8 p-0 m-0-fluid">
              {this.props.check_joins
                ? "Join beállítás rendben."
                : "Join beállítás hiányzik!"}
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-1 p-0 m-2">
              {this.props.check_name ? (
                <button className="act-button"></button>
              ) : (
                <button className="deact-button"></button>
              )}
            </div>
            <div className="col-8 p-0 m-0-fluid">
              {this.props.check_name
                ? "Táblanév rendben."
                : "Táblanév hiányzik!"}
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-1 p-0 m-2">
              {this.props.check_metamodel ? (
                <button className="act-button"></button>
              ) : (
                <button className="deact-button"></button>
              )}
            </div>
            <div className="col-8 p-0 m-0-fluid">
              {this.props.check_metamodel
                ? "Metamodel rendben."
                : "Metamodel hiányzik!"}
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-1 p-0 m-2">
              {this.props.check_columns ? (
                <button className="act-button"></button>
              ) : (
                <button className="deact-button"></button>
              )}
            </div>
            <div className="col-8 p-0 m-0-fluid">
              {this.props.check_columns
                ? "Oszlopok rendben."
                : "Oszlop beállítás hiányzik!"}
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-1 p-0 m-2">
              {this.props.check_tables ? (
                <button className="act-button"></button>
              ) : (
                <button className="deact-button"></button>
              )}
            </div>
            <div className="col-8 p-0 m-0-fluid">
              {this.props.check_tables
                ? "Forrástáblák rendben."
                : "Forrástáblák hiányoznak!"}
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-1 p-0 m-2">
              {this.props.check_table_type ? (
                <button className="act-button"></button>
              ) : (
                <button className="deact-button"></button>
              )}
            </div>
            <div className="col-8 p-0 m-0-fluid">
              {this.props.check_table_type
                ? "Tábla típus rendben."
                : "Tábla típus hiányzik!"}
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-1 p-0 m-2">
              {this.props.check_dim_key ? (
                <button className="act-button"></button>
              ) : (
                <button className="deact-button"></button>
              )}
            </div>
            <div className="col-8 p-0 m-0-fluid">
              {this.props.check_dim_key
                ? "Dimenzió kulcs rendben."
                : "Dimenzió kulcs hiányzik!"}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Checklist;
