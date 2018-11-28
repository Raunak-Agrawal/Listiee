import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";
import { oauthGoogle } from "../../actions/authActions";
import { oauthFacebook } from "../../actions/authActions";
import * as actions from "../../actions/authActions";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
    this.responseGoogle = this.responseGoogle.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    // console.log(newUser);

    this.props.registerUser(newUser, this.props.history);
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  async responseGoogle(res) {
    console.log("responseGoogle", res);
    await this.props.oauthGoogle(res.accessToken);

    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  async responseFacebook(res) {
    console.log("responseFacebook", res);
    await this.props.oauthFacebook(res.accessToken);

    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your Listiee account</p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.name
                    })}
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    required
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.email
                    })}
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                  <small className="form-text text-muted">
                    This site uses Gravatar so if you want a profile image, use
                    a Gravatar email
                  </small>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.password
                    })}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.password2
                    })}
                    placeholder="Confirm Password"
                    name="password2"
                    value={this.state.password2}
                    onChange={this.onChange}
                  />
                  {errors.password2 && (
                    <div className="invalid-feedback">{errors.password2}</div>
                  )}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
          <div className="col" style={{ marginBottom: "10px" }}>
            <div className="text-center">
              <div className="alert alert-primary">
                Or sign up using third party services
              </div>
              <FacebookLogin
                appId="2055890568055031"
                // autoLoad={true}
                textButton="Facebook"
                fields="name,email,picture"
                callback={this.responseFacebook}
                cssClass="btn btn-outline-primary"
              />
              <GoogleLogin
                clientId="94519459508-v7poujk5af6jfviifs44uo74o2ne9gv2.apps.googleusercontent.com"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                buttonText="Google"
                className="btn btn-outline-danger"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { registerUser, oauthGoogle, oauthFacebook }
)(withRouter(Register));
