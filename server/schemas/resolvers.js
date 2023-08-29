const { AuthenticationError } = require('apollo-server-express');
const { User, Post, Comment, Reaction } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    // posts: async (parent, { _id }) => {
    //   return await Post.findById(_id).populate('category');
    // },
    // comments: async () => {
    //   return await Comment.find();
    // },
    // reactions: async (parent, args, context) => {
    //   if (context.user) {
    //     const user = await User.findById(context.user._id).populate({
    //       path: 'orders.posts',
    //       populate: 'category',
    //     });

    //     user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

    //     return user;
    //   }

    //   throw new AuthenticationError('Not logged in');
    // },
  },
  Mutation: {
    signUp: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      console.log(token);
      return { token, user };
    },
    // addPost: async (parent, { products }, context) => {
    //   console.log(context);
    //   if (context.user) {
    //     const order = new Post({ products });

    //     await User.findByIdAndUpdate(context.user._id, {
    //       $push: { orders: order },
    //     });

    //     return order;
    //   }

    //   throw new AuthenticationError('Not logged in');
    // },
    // updateUser: async (parent, args, context) => {
    //   if (context.user) {
    //     return await User.findByIdAndUpdate(context.user._id, args, {
    //       new: true,
    //     });
    //   }

    //   throw new AuthenticationError('Not logged in');
    // },
    // updatePost: async (parent, { _id, quantity }) => {
    //   const decrement = Math.abs(quantity) * -1;

    //   return await Post.findByIdAndUpdate(
    //     _id,
    //     { $inc: { quantity: decrement } },
    //     { new: true }
    //   );
    // },
    

      
  },
};

module.exports = resolvers;
