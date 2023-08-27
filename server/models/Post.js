const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  body: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
