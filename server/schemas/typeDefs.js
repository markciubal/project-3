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

  type Auth {
    token: ID
    user: User
  }

  type Query {
    comments: [Comment]
    reactions(_id: ID!): Product
    users: [User]
    posts: [Post]
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    addOrder(products: [ID]!): Order
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    updateProduct(_id: ID!, quantity: Int!): Product
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
