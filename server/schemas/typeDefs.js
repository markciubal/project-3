const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type User {
    _id: ID
    username: String
    email: String!
    posts: [Post]
  }

  type Comment {
    _id: ID
    body: String
  }

  type Post {
    _id: ID
    user: User
    body: String
    latitude: Float!
    longitude: Float!
    createdAt: Date!
    comments: [Comment]
  }

  
  
  type Reaction { 
  _id: ID
  body: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    users: [User]
    posts: [Post]
  }

  type Mutation {
    signUp(username: String!, email: String!, password: String!): Auth
    login(username: String!, password: String!): Auth
    addPost(body: String!, latitude: Float!, longitude: Float!): Post
  }
`;

module.exports = typeDefs;

// Full query.
// type Query {
//   users: [User]
//   posts: [Post]
//   comments: [Comment]
//   reactions: [Reaction]
// }

// Full Mutations:
// type Mutation {
//   signUp(userName: String!, firstName: String!, lastName: String!, email: String!, password: String!): Auth
//   login(email: String!, password: String!): Auth
//   addPost(body: String!, comments: [Comment]): Post
//   updateUser(firstName: String, lastName: String, email: String, password: String): User
//   updatePost(_id: ID!, quantity: Int!): Post
  
// }