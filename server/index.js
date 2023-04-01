const express = require('express')
const mongoose = require('mongoose')
const Todo = require('./todoModel')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
require('dotenv').config()
app.use(cors())
app.use(bodyParser.json())

mongoose.connect(process.env.MONGODB_URI).then(res => console.log("database connected"))

app.get('/', async (req, res) => {

    const todos = await Todo.find({})

    res.status(200).json({
        todos: todos
    })
})
app.post('/add-todo', async (req, res) => {
    const body = req.body;
    const todos = await Todo.find({})
    // console.log(length.length)
    const newTodo = new Todo({
        text: body.text,
        status: body.status,
        position : todos.length 
    })
    const savedTod = await newTodo.save()
    return res.status(200).json({
        todo : savedTod
    })
})

app.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const todo = req.body;
    console.log(id, todo)
    const updatedTodo = await Todo.findByIdAndUpdate(id, todo, {new: true})
    res.status(200).json({
        todo: updatedTodo
    })
})
app.patch('/update-all', async (req, res) => {
    const updatedTodos = req.body;
    const todosToSend =  updatedTodos.map(async (todo) => {
        const newTodo = await Todo.findByIdAndUpdate(todo._id, todo, {new : true})
        return newTodo;
    })
    console.log(todosToSend)
    return res.status(200).json({
        message: "todos updated",
        todos: todosToSend
    })

})
app.listen(process.env.PORT || 5000, () => {
    console.log("server started")
})