import { gql } from '@apollo/client';

export const SIGNUP = gql`
  mutation signup($username: String! $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_POST = gql`
  mutation addPost($username: String!, $body: String!) {
  addPost(username: $username, body: $body) {
    Post
    }
  }
`;