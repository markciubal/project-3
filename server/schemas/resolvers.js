const { AuthenticationError } = require('apollo-server-express');
const { User, Post, Comment, Reaction } = require('../models');
const { signToken } = require('../utils/auth');
const { GraphQLScalarType } = require('graphql');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    users: async () => {
      return await User.find();
    },
    posts: async () => {
      return await Post.find().populate('user');
    },
    post: async (parent, args) => {
      return await Post.findOne({ _id: args._id }).populate('user');
    },
    // posts: async (parent, { _id }) => {
    //   if (context.user) {
    //     const 
    //   }
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
        throw new AuthenticationError('Incorrect credentials.');
      }
      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError('Incorrect credentials.');
      }

      const token = signToken(user);
      return { token, user };
    },
    addPost: async (parent, { body, latitude, longitude }, context) => {
      // console.log('test before context.');
      // console.log(context);
      
      if (context.user) {
        const newPost = await Post.create({ user: context.user._id, body, latitude, longitude });
        return newPost;
      }

      throw new AuthenticationError('Not logged in.');
    },
    deletePost: async (parent, { userId, postId }, context) => {
      // console.log('test before context.');
      // console.log(context);
      
      if (context.user._id.toString() === userId) {
        const operation = Post.findOneAndDelete({ _id: postId });
        console.log(operation);
        return operation;
      }

      throw new AuthenticationError('Not logged in.');
    },
    updatePost: async (parent, { userId, postId, body }, context) => {
      // console.log('test before context.');
      // console.log(context);
      
      if (context.user._id.toString() === userId) {
        const operation = Post.findOneAndUpdate({ _id: postId, body: body });
        console.log(operation);
        return operation;
      }

      throw new AuthenticationError('Not logged in.');
    },
    // updateUser: async (parent, args, context) => {
    //   if (context.user) {
    //     return await User.findByIdAndUpdate(context.user._id, args, {
    //       new: true,
    //     });
    //   }

        // await User.findByIdAndUpdate(context.user._id, {
          // $push: { orders: order },
        // });
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
