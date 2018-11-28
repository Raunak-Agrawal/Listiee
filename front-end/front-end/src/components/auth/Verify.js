import React, { Component } from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";
// import classnames from "classnames";
import { verifyUser } from "../../actions/authActions";
import axios from "axios";
import { withRouter } from "react-router-dom";

class Verify extends Component {
  constructor() {
    super();
    this.state = {
      secretToken: "",
      errors: {},
      active: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();
    console.log("added");
    const userData = {
      secretToken: this.state.secretToken,
      active: this.state.active
    };

    this.props.verifyUser(userData, this.props.history);
  }

  render() {
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Verify</h1>
              <p className="lead text-center">Verify your account</p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Token"
                    name="secretToken"
                    value={this.state.secretToken}
                    onChange={this.onChange}
                  />
                </div>

                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { verifyUser }
)(withRouter(Verify));
