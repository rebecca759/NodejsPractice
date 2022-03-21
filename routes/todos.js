const { response } = require('express')
const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')
const auth = require('./auth')

// Getting all Todos
router.get('/', [auth.authenticateToken,auth.verifyAdmin], async (req,res) => {
    try {
        const todos = await Todo.find()
        todos.filter(todo => todo.username === req.user.username)
        res.json(todos)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// Getting Todo by ID
router.get('/:id', getTodo, (req,res) => {
    res.json(res.todo)
})

// Creating one Todo
router.post('/', auth.authenticateToken, async (req,res) => {
    console.log(req.user)
    const todo = new Todo({
        name: req.body.name,
        description: req.body.description,
        username: req.user.username
    })
    try{
        const newTodo = await todo.save()
        res.status(201).json(newTodo)
    }catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Updating One
router.patch('/:id', getTodo,async (req,res) => {
    if (req.body.name != null) {
        res.todo.name = req.body.name
    } 
    if (req.body.description != null) {
        res.todo.description = req.body.description
    }
    if (req.body.completed) {
        res.todo.completed = true
    }

    try {
        const updatedTodo = await res.todo.save()
        res.json(updatedTodo)
    } catch (error) {
        res.status(400).json({message: error.message})}
})

// Deleting One
router.delete('/:id', getTodo, async (req,res) => {
    try {
        await res.todo.remove()
        res.json({ mesage: 'Deleted Todo' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// middleware for funs with id
async function getTodo(req,res,next) {
    let todo
    try {
        todo = await Todo.findById(req.params.id)
        if (todo == null) {
            return res.status(404).json({ message: 'Cannot find todo' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.todo = todo
    next()
}

module.exports = router