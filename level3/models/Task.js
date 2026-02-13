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
  },
  // Level 3: Danh sách users được phân công
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Level 3: Danh sách users đã hoàn thành
  completedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Kiểm tra task đã hoàn thành chưa (tất cả assignedTo phải nằm trong completedBy)
taskSchema.methods.checkCompletion = function() {
  if (this.assignedTo.length === 0) return this.isDone;

  const assignedIds = this.assignedTo.map(id => id.toString());
  const completedIds = this.completedBy.map(id => id.toString());

  const allCompleted = assignedIds.every(id => completedIds.includes(id));

  if (allCompleted) {
    this.isDone = true;
    this.doneAt = new Date();
  } else {
    this.isDone = false;
    this.doneAt = null;
  }

  return this.isDone;
};

module.exports = mongoose.model('Task', taskSchema);
