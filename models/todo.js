const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    username: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Todo',todoSchema)