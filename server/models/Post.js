const User = require('./User');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  user: {
    type: User,
    required: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
