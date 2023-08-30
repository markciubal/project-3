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
  latitude: {
    type: Number,
    required: true,
    trim: true
  },
  longitude: {
    type: Number,
    required: true,
    trim: true
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: false
  }
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
