const express = require(`express`);
const todoController = require(`../Controllers/controllers`)
const router = express.Router();
// 
router.get(`/`, todoController.todoList);
router.post(`/`, todoController.todoAdd);
router.delete(`/:id`, todoController.todoDelete);
router.put(`/:id`, todoController.todoUpdate);
// 
module.exports = router;