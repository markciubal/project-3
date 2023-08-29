const { gql } = require('apollo-server-express');

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
    maxlength: 255
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    categories: [Category]
    products(category: ID, name: String): [Product]
    product(_id: ID!): Product
    user: User
    order(_id: ID!): Order
    checkout(products: [ProductInput]): Checkout
  }

  type Mutation {
    signUp(userName: String!, firstName: String!, lastName: String!, email: String!, password: String!): Auth
    addPost(body: String!, comments: [Comment]): Order
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    updatePost(_id: ID!, quantity: Int!): Product
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
