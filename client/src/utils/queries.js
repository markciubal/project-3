import { gql } from '@apollo/client';

export const GET_ALL_POSTS = gql`
    query Query {
        posts {
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

export const GET_ONE_POST = gql`
    query ($id: ID!) {
        post(_id: $id) {
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

export const GET_ME = gql`
  query me {
    me {
      _id
    }
  }
`;
