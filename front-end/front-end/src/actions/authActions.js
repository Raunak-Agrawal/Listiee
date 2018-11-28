import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

export const oauthGoogle = data => {
  // axios.post("/api/users/oauth/google", data).then(res => console.log(res));
  // console.log("we recived", data);
  return async dispatch => {
    console.log(data);
    const res = await axios.post("/api/users/outh/google", {
      access_token: data
    });
    dispatch({
      type: SET_CURRENT_USER,
      payload: res.data.token
    });
    localStorage.setItem("jwtToken", res.data.token);
  };
};

export const oauthFacebook = data => {
  // axios.post("/api/users/oauth/google", data).then(res => console.log(res));
  // console.log("we recived", data);
  return async dispatch => {
    console.log(data);
    const res = await axios.post("/api/users/outh/facebook", {
      access_token: data
    });
    dispatch({
      type: SET_CURRENT_USER,
      payload: res.data.token
    });
    localStorage.setItem("jwtToken", res.data.token);
  };
};

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/verify"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = history => dispatch => {
  history.push("/login");
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

export const verifyUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/verify", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};