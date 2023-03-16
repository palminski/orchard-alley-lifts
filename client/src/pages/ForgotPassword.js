import { useState } from "react";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "../utils/mutations";


const ForgotPassword = (props) => {
  const [formState, setFormState] = useState({ username: "", email: ""});
  const [resetPassword, { error }] = useMutation(RESET_PASSWORD);
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
    console.log(formState);
    try {
      const response = await resetPassword({
        variables: formState
      });
    } catch (error) {
      console.log(formState);
      console.log(error);
      setErrorMessage("A user with this email could not be found!")
    }
  };

  return (
    <>
      <div className="formCon">
      <form onSubmit={handleFormSubmit} className="loginForm">
      <h1>Forgot Password</h1>
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
        {errorMessage && <p>{errorMessage}</p>}
        <div className="buttonCon">
        <button className="loginBtn" type="submit">Submit</button>
        </div>
        
      </form>
      </div>

    </>
  );
};

export default ForgotPassword;
