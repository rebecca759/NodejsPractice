require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')


const connectDB = require('./db')
connectDB()

// app.use(express.json())

// const subscribersRouter = require('./routes/subscribers')
// app.use('/subscribers', subscribersRouter)

//allow server to accept json - middleware
app.use(express.json())

const subscribersRouter = require('./routes/subscribers')
const todosRouter = require('./routes/todos')
const authRouter = require('./routes/auth')

app.use('/subscribers',subscribersRouter)
app.use('/todos',todosRouter)
app.use('/auth',authRouter)

app.listen(3000, () => console.log('Server Started'))