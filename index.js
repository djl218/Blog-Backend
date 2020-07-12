const express = require('express')
const app = express()
require('dotenv').config()
const Blog = require('./models/blog')

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.get('/api/blogs', (request, response) => {
    Blog.find({}).then(blogs => {
        response.json(blogs)
    })
})

app.post('/api/blogs', (request, response, next) => {
    const blog = new Blog(request.body)

    blog.save().then(result => {
        response.status(201).json(result)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
