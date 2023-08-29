const { gql } = require('apollo-server-express');
const { User, Post, Comment, Reaction } = require('../models');
const typeDefs = gql`
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    posts: [Post]
  }

  type Post {
    _id: ID
    body: String
  }

  input Comment {
  _id: ID
  body: String
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
    comments: [Comment]
    reactions: [Reaction]
  }

  type Mutation {
    signUp(userName: String!, firstName: String!, lastName: String!, email: String!, password: String!): Auth
    addPost(body: String!, comments: [Comment]): Post
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    updatePost(_id: ID!, quantity: Int!): Post
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
