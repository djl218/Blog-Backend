const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const blog = require('../models/blog')
const user = require('../models/user')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await blog.deleteMany({})
        
        const blogObjects = helper.initialBlogs
            .map(blog => new Blog(blog))
        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)     
})

beforeEach(async () => {
    await user.deleteMany({})
        
        const userObjects = helper.initialUsers
            .map(user => new User(user))
        const promiseArray = userObjects.map(user => user.save())
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
    const user = {
        username: 'testUser',
        password: 'test'
    }

    const response = await api
        .post('/api/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const token = response.body.token
    
    const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://testsite.com/',
        likes: 1
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const title = blogsAtEnd.map(n => n.title)
    expect(title).toContain(
        'Test Blog'
    )
})

test('new blog can be added only if it has a token', async () => {
    const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://testsite.com/',
        likes: 1
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
})

test('if the likes property is missing, a default value of zero will be assigned', async () => {
    const blogsAtStart = await helper.blogsInDb()

    return blogsAtStart.likes === undefined
        ? blogsAtStart.likes = 0
        : blogsAtStart
})

test('a new blog needs a title and url for it to be added to list', async () => {
    const user = {
        username: 'testUser',
        password: 'test'
    }

    const response = await api
        .post('/api/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const token = response.body.token

    const newBlog = {
        author: 'David Walsh'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
})

test('if blog has valid id, it can be deleted, response will be status code 204', async () => {
    const user = {
        username: 'testUser',
        password: 'test'
    }

    const response = await api
        .post('/api/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const token = response.body.token
   
    const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://testsite.com/',
        likes: 1
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogs = await api.get('/api/blogs')
    const blogToDelete = blogs.body[blogs.body.length - 1]  

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
    )

    const ids = blogsAtEnd.map(r => r.id)

    expect(ids).not.toContain(blogToDelete.id)
})

afterAll(() => {
    mongoose.connection.close()
})