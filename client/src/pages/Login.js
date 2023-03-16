import { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { LOGIN_USER } from "../utils/mutations";

import ErrorModal from "../components/ErrorModal";

const Login = (props) => {
  const [login, { error }] = useMutation(LOGIN_USER);
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setErrorMessage("");
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await login({
        variables: {
          username: formState.username,
          password: formState.password,
        },
      });
      const token = response.data.loginUser.token;
      Auth.login(token);
      props.setPageSelected("Home");
    } catch (error) {
      console.log(formState);
      console.log(error);
      setErrorMessage("Password Incorrect")
    }
  };

  return (
    <>
      <div className="formCon">
      <form onSubmit={handleFormSubmit} className="loginForm">
      <h1>Login</h1>
        <div className="formEl">
          <label htmlFor="username">Username: </label>
          <input
            name="username"
            type="username"
            id="username"
            onChange={handleFormChange}
          />
        </div>
        <div className="formEl">
          <label htmlFor="password">Password: </label>
          <input
            name="password"
            type="password"
            id="password"
            onChange={handleFormChange}
          />
        </div>
        {errorMessage && <p>{errorMessage}</p>}
        <div className="buttonCon">
        <button className="loginBtn" type="submit">Submit</button>
        </div>
        <br></br>
        <p className="clickableP" onClick={() => {props.setPageSelected("Signup");}}>Don't have an account? Create a new account here!</p>
        <p className="clickableP" onClick={() => {props.setPageSelected("ForgotPassword");}}>Forgot Password?</p>
        
      </form>
      </div>
    </>
  );
};

export default Login;
