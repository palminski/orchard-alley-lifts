import { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { LOGIN_USER } from "../utils/mutations";

const Login = (props) => {
  const [login, { error }] = useMutation(LOGIN_USER);
  const [formState, setFormState] = useState({ username: "", password: "" });

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
    }
  };

  return (
    <>
      <div className="formCon">
      <form onSubmit={handleFormSubmit}>
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
        <div className="buttonCon">
        <button type="submit">Submit</button>
        </div>
      </form>
      </div>
    </>
  );
};

export default Login;
