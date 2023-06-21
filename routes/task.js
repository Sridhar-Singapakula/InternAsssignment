const router = require("express").Router();
const auth = require("../middleware/auth");
const { Task, validateTask } = require('../models/task');
const validateObjectId = require("../middleware/validateObjectId");

// Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { error } = validateTask(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { title, description, dueDate, priority, status } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
    });

    await task.save();

    res.status(201).send({ data: task });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Update task details
router.put('/:id', [validateObjectId, auth], async (req, res) => {
    try {
     
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      if (!task) {
        return res.status(404).send({ message: 'Task not found' });
      }
  
      res.status(200).send({ data: task, message: 'Task updated successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  });
  

// Delete a task
router.delete('/:id', [validateObjectId, auth], async (req, res) => {
  try {
    const task = await Task.findByIdAndRemove(req.params.id);
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }

    res.status(200).send({ data: task, message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get all tasks with filter and sorting
// Get all tasks with filter, sorting, and pagination
router.get('/', auth, async (req, res) => {
  try {
    const { status, sortBy, page, limit } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    let sortOptions = {};

    if (sortBy === 'dueDate') {
      sortOptions.dueDate = 1; // Sort by dueDate in ascending order
    }

    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const tasksPromise = Task.find(query).sort(sortOptions).skip(skip).limit(pageSize);
    const countPromise = Task.countDocuments(query);

    const [tasks, totalCount] = await Promise.all([tasksPromise, countPromise]);

    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).send({
      data: tasks,
      currentPage: pageNumber,
      totalPages: totalPages,
      totalCount: totalCount
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


// Get task by ID
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }

    res.status(200).send({ data: task });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
