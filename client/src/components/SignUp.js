import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP } from '../utils/mutations';

import Auth from '../utils/auth';

const SignUp = (props) => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [signUp, { error, data }] = useMutation(SIGNUP);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await signUp({
        variables: { ...formState },
      });

      Auth.login(data.signUp.token);
      props.setIsSignUpPaneOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="d-flex row justify-content-center mb-4">
      <div className="col-12 col-lg-10">
        <div className="card">
          <h4 className="card-header bg-dark text-light p-2">Sign Up</h4>
          <div className="card-body">
            {data ? (
              <p>
                Success! You may now head{' '}
              </p>
            ) : (
              <form className="d-grid gap-3" onSubmit={handleFormSubmit}>
                <div className="d-flex justify-content-between"> 
                  <input
                    className="form-input text-center w-100 me-2 border border-dark rounded"
                    placeholder="Your username"
                    name="username"
                    type="text"
                    value={formState.username}
                    onChange={handleChange}
                  />
                  <input
                    className="form-input text-center w-100 ms-2 border border-dark rounded"
                    placeholder="Your email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                  />
                </div>
                <input
                  className="form-input text-center w-100 border border-dark rounded"
                  placeholder="Please enter password"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                />
                <button
                  className="btn btn-block btn-flat w-100"
                  style={{ cursor: 'pointer' }}
                  type="submit"
                >
                  Submit
                </button>
              </form>
            )}

            {error && (
              <div className="my-3 p-3 bg-danger text-white">
               There was an error.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
