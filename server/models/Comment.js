const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  user: {
    type: User,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  reactions: [
    {
      type: String,
      ref: 'Reaction'
    }
  ]
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
