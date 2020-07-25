const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const blog = require('../models/blog')
const api = supertest(app)

const Blog = require('../models/blog')

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

test('a new blog can be added', async () => {
    const newBlog = {
        title: 'David Walsh Blog',
        author: 'David Walsh',
        url: 'https://davidwalsh.name/'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const title = blogsAtEnd.map(n => n.title)
    expect(title).toContain(
        'David Walsh Blog'
    )
})

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

afterAll(() => {
    mongoose.connection.close()
})