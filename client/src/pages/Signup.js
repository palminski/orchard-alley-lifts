import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";

const Signup = (props) => {
  const [formState, setFormState] = useState({ username: "", password: "", email: ""});
  const [addUser, { error }] = useMutation(ADD_USER);

  const handleFormChange = (event) => {
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
      console.log(formState);
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
            name="password"
            type="password"
            id="password"
            onChange={handleFormChange}
          />
        </div>
        <div className="buttonCon">
        <button className="loginBtn" type="submit">Submit</button>
        </div>
        <br></br>
        <p className="clickableP" onClick={() => {props.setPageSelected("Login");}}>Already have an account? Click here to login!</p>
      </form>
      </div>

    </>
  );
};

export default Signup;
