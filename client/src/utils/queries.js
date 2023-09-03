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