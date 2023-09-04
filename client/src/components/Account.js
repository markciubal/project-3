import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN, SIGNUP } from '../utils/mutations';
import Auth from '../utils/auth';

const Account = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error: loginError }] = useMutation(LOGIN);
  const [signup, { error: signupError }] = useMutation(SIGNUP);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });
      const token = mutationResponse.data.login.token;
      Auth.login(token);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await signup({
        variables: { email: formState.email, password: formState.password },
      });
      const token = mutationResponse.data.signup.token;
      Auth.login(token);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div className="container my-1">
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <div className="flex-row space-between my-2">
            <label htmlFor="email">Email address:</label>
            <input
              placeholder="youremail@test.com"
              name="email"
              type="email"
              id="email"
              onChange={handleChange}
            />
          </div>
          <div className="flex-row space-between my-2">
            <label htmlFor="pwd">Password:</label>
            <input
              placeholder="******"
              name="password"
              type="password"
              id="pwd"
              onChange={handleChange}
            />
          </div>
          {loginError && <p className="error-text">The provided credentials are incorrect</p>}
          <div className="flex-row flex-end">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
      <div>
        <h2>Signup</h2>
        <form onSubmit={handleSignupSubmit}>
          <div className="flex-row space-between my-2">
            <label htmlFor="email">Email address:</label>
            <input
              placeholder="youremail@test.com"
              name="email"
              type="email"
              id="email"
              onChange={handleChange}
            />
          </div>
          <div className="flex-row space-between my-2">
            <label htmlFor="pwd">Password:</label>
            <input
              placeholder="******"
              name="password"
              type="password"
              id="pwd"
              onChange={handleChange}
            />
          </div>
          {signupError && <p className="error-text">Error creating an account</p>}
          <div className="flex-row flex-end">
            <button type="submit">Signup</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Account;