const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề task là bắt buộc'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  isDone: {
    type: Boolean,
    default: false
  },
  doneAt: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
