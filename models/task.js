const mongoose = require('mongoose');
const Joi = require('joi');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low',
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  
} );

const Task = mongoose.model('Task', taskSchema);

function validateTask(task) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    dueDate: Joi.date().required(),
    priority: Joi.string().valid('low', 'medium', 'high').default('low'),
    status: Joi.string().valid('pending', 'completed').default('pending'),
  });
  return schema.validate(task);
}

module.exports = { Task, validateTask };
