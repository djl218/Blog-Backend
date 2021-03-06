const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({}).populate('blogs', { title: 1,  author: 1, url: 1, likes: 1, userComments: 1 })
    
    response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
    const user = await User
    .findById(request.params.id)

    response.json(user)
})

usersRouter.post('/', async (request, response) => {
    const body = request.body
    if (body.password.length < 3) {
        return response.status(400).json({ error: 'password is less than required length of 3'})
    }
    if (body.username.length < 3) {
        return response.status(400).json({ error: 'username is less than required length of 3'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

usersRouter.put('/:id', async (request, response) => {
    const body = request.body
    const updatedBookmarks = {
        userId: body.id,
        bookmarks: body.bookmarks
    }

    await User
    .findByIdAndUpdate(request.params.id, updatedBookmarks,
        { userId: body.userId, bookmarks: body.bookmarks }
    )
    .populate('bookmarks', { title: 1, author: 1 })
    response.status(200).json(updatedBookmarks)
})

module.exports = usersRouter