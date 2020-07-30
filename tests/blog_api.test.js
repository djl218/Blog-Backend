const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const blog = require('../models/blog')
const api = supertest(app)
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await blog.deleteMany({})
        
        const blogObjects = helper.initialBlogs
            .map(blog => new Blog(blog))
        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)     
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('blogs are identified by "id" not "_id"', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const ids = blogsAtStart.map(r => r.id)

    expect(ids).toBeDefined()
})

test('a new blog can be added only if there is a token', async () => {    
    //const usersAtStart = await helper.usersInDb()
    //const user = usersAtStart[0]

    const user = new User({
        username: 'testUser',
        password: 'testPassword'
    })

    //const user = await User.findOne({ username: 'redDog14' })

    const response = await api
        .post('/api/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    console.log(response.body)
    const token = response.map(r => r.token)
    console.log(token)
    
    const newBlog = new Blog({
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://testsite.com/',
        likes: 1
    })

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${response.token[0]}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const title = blogsAtEnd.map(n => n.title)
    expect(title).toContain(
        'Test Blog'
    )
})

/*const userForToken = {
        username: 'redDog14',
        id: '5f1dc5f38912bb3bf9283aa1'
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    console.log(decodedToken.id)

    const users = await helper.usersInDb()
    const users = await User.findById(decodedToken.id)
    //console.log(user)*/

/*test('new blog can be added only if it has a token', async () => {

})*/

test('if the likes property is missing, a default value of zero will be assigned', async () => {
    const blogsAtStart = await helper.blogsInDb()

    return blogsAtStart.likes === undefined
        ? blogsAtStart.likes = 0
        : blogsAtStart
})

test('a new blog needs a title and url for it to be added to list', async () => {
    const newBlog = {
        author: 'David Walsh'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
})

test('if blog has valid id, it can be deleted, response will be status code 204', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
    )

    const ids = blogsAtEnd.map(r => r.id)

    expect(ids).not.toContain(blogToDelete.id)
})

afterAll(() => {
    mongoose.connection.close()
})