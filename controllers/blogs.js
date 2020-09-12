const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)   
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User
    .findById(decodedToken.id).populate('user', { username: 1, name: 1 })

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: (
            body.likes === undefined 
            ? 0 
            : body.likes
        ),
        user
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET) 
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    
    const blog = await Blog
    .findById(request.params.id)

    if (decodedToken.id.toString() !== blog.user.toString()) {
        return response.status(404).json({ error: 'user is only able to delete blogs that they have added' })
    } 

    await blog.remove()
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const likedBlog = {
        id: body.id,
        likes: body.likes
    }

    await Blog
    .findByIdAndUpdate(request.params.id, likedBlog, { id: body.id, likes: body.likes })
    .populate('user', { username: 1, name: 1 })
    response.status(200).json(likedBlog)
})

blogsRouter.put('/:id/comments', async (request, response) => {
    const body = request.body

    const blogWithComment = {
        blogId: body.blogId,
        userComments: body.userComments
    }

    await Blog
    .findByIdAndUpdate(request.params.id, blogWithComment, { blogId: body.blogId, userComments: body.userComments })
    .populate('user', { username: 1, name: 1 })
    response.status(200).json(blogWithComment)
})

module.exports = blogsRouter