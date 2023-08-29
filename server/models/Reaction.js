const mongoose = require('mongoose');

const { Schema } = mongoose;

const reactionSchema = new Schema({
  user: {
    type: String,
    required: true,
    trim: true
  },
  reaction: {
    type: String,
    maxlength: 1
  }
});

const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = Reaction;
