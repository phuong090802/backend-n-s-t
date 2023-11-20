import express from 'express';
import {
    handleCreateTodo,
    handleGetAllTodo,
    handleGetTodo,
    handleUpdateTodo,
    handleUpdateStatusTodo,
} from '../controllers/todo.js';

const router = express.Router();

router.route('/:id')
    .get(handleGetTodo)
    .put(handleUpdateTodo)
    .patch(handleUpdateStatusTodo);

router.route('/')
    .get(handleGetAllTodo)
    .post(handleCreateTodo);

export default router;