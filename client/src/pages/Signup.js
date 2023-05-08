import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import gainsIcon from "../images/icons/Will_Design.svg";

const Signup = (props) => {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [addUser, { error }] = useMutation(ADD_USER);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormChange = (event) => {
    setErrorMessage("");
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await addUser({
        variables: {
          username: formState.username,
          email: formState.email,
          password: formState.password,
        },
      });
      const token = response.data.addUser.token;
      Auth.login(token);
      props.setPageSelected("Home");
    } catch (error) {
      setErrorMessage(
        "Username and Email must be unique, Password Must be at least 8 characters"
      );
      console.log(error);
    }
  };

  return (
    <>
      <div className="formCon">
        <form onSubmit={handleFormSubmit} className="loginForm">
          <h1>Signup</h1>
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
            <label htmlFor="email">Email:</label>
            <input
              name="email"
              type="email"
              id="email"
              onChange={handleFormChange}
            />
          </div>
          <div className="formEl">
            <label htmlFor="password">Password: </label>
            <input
              minLength={8}
              name="password"
              type="password"
              id="password"
              onChange={handleFormChange}
            />
          </div>
          {errorMessage && <p>{errorMessage}</p>}
          <div className="buttonCon">
            <button className="loginBtn" type="submit">
              Submit
            </button>
          </div>
          <br></br>
          <p
            className="clickableP"
            onClick={() => {
              props.setPageSelected("Login");
            }}
          >
            Already have an account? Click here to login!
          </p>
        </form>
      </div>
      <div className="icon-containter">
        <img src={gainsIcon} className="gains-icon" alt="Master Gains icon" />
      </div>
    </>
  );
};

export default Signup;
