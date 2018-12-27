const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todoController.js');

const todo = new TodoController();

router.get('/todos', todo.getList);
router.post('/todos', todo.createTodo);

module.exports = router;
