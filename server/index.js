const express = require('express')
const mongoose = require('mongoose')
const Todo = require('./todoModel')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
app.use(cors())
app.use(bodyParser.json())

mongoose.connect('mongodb://127.0.0.1:27017/todo').then(res => console.log("database connected"))

app.get('/', async (req, res) => {

    const todos = await Todo.find({})

    res.status(200).json({
        todos: todos
    })
})
app.post('/add-todo', async (req, res) => {
    const body = req.body;
    const newTodo = new Todo({
        text: body.text,
        status: body.status
    })
    const savedTod = await newTodo.save()
    return res.status(200).json({
        todo : savedTod
    })
})
app.listen(5000, () => {
    console.log("server started")
})