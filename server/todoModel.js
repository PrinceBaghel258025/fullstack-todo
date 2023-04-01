const mongoose  = require('mongoose')

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "complete"],
        default: 'pending'
    },
    position: Number
})

const Todo = mongoose.model('Todos', todoSchema)

module.exports = Todo;