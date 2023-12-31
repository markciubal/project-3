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
  mutation addPost($body: String!, $latitude: Float!, $longitude: Float!) {
    addPost(body: $body, latitude: $latitude, longitude: $longitude) {
      body
      latitude
      longitude
      createdAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($userId: ID!, $postId: ID!) {
    deletePost(userId: $userId, postId: $postId) {
      user {
          _id
      }
      _id
    }
  }
`;

export const UPDATE_POST = gql`
  mutation updatePost($userId: ID!, $postId: ID!, $body: String!) {
    updatePost(userId: $userId, postId: $postId, body: $body) {
      user {
          _id
      }
      _id
    }
  }
`;