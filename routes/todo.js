import express from 'express';
import {
    handleCreateTodo,
    handleGetAllTodo,
    handleGetTodo,
    handleUpdateTodo
} from '../controllers/todo.js';

const router = express.Router();

router.route('/:id')
    .get(handleGetTodo)
    .put(handleUpdateTodo)

router.route('/')
    .get(handleGetAllTodo)
    .post(handleCreateTodo)

export default router;