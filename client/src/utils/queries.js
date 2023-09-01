import { gql } from '@apollo/client';

export const GET_ALL_POSTS = gql`
  {
    post {
      _id
      user {
        _id
        username
      }
      body
      latitude
      longitude
      createdAt
    }
  }
`;