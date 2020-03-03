import React, { useState } from "react";
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";
import { AUTH_TOKEN } from "../../constants";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const getNewUserData = (key, value) => prevState => ({
  ...prevState,
  [key]: value
});

const toggleLogin = prevState => ({
  ...prevState,
  login: !prevState.login
});


const Login = props => {
  const [userData, setUserData] = useState({
    login: true,
    email: "",
    password: "",
    name: ""
  });
  const { login, email, password, name } = userData;

  const _confirm = async data => {
    const { token } = login ? data.login : data.signup
    _saveUserData(token)
    props.history.push('/')
  };
  
  const _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  return (
    <div>
      <h4 className="mv3">{login ? "Login" : "Sign Up"}</h4>
      <div className="flex flex-column">
        {!login && (
          <input
            value={name}
            onChange={e => setUserData(getNewUserData("name", e.target.value))}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={email}
          onChange={e => setUserData(getNewUserData("email", e.target.value))}
          type="text"
          placeholder="Your email address"
        />
        <input
          value={password}
          onChange={e =>
            setUserData(getNewUserData("password", e.target.value))
          }
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <Mutation
          mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
          variables={{ email, password, name }}
          onCompleted={data => _confirm(data)}
        >
          {mutation => (
            <div className="pointer mr2 button" onClick={mutation}>
              {login ? "login" : "create account"}
            </div>
          )}
        </Mutation>
        <div
          className="pointer button"
          onClick={() => setUserData(toggleLogin)}
        >
          {login ? "need to create an account?" : "already have an account?"}
        </div>
      </div>
    </div>
  );
};

export default Login;
