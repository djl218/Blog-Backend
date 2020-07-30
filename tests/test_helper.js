const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    { 
        _id: "5a422a851b54a676234d17f7", 
        title: "React patterns", 
        author: "Michael Chan", 
        url: "https://reactpatterns.com/", 
        likes: 7, 
        __v: 0 
    }, 
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful", 
        author: "Edsger W. Dijkstra",  
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
        likes: 5, 
        __v: 0 
    }, 
    { 
        _id: "5a422b3a1b54a676234d17f9", 
        title: "Canonical string reduction", 
        author: "Edsger W. Dijkstra", 
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", 
        likes: 12, 
        __v: 0 
    }, 
    { 
        _id: "5a422b891b54a676234d17fa", 
        title: "First class tests", 
        author: "Robert C. Martin", 
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", 
        likes: 10, 
        __v: 0 
    }, 
    { 
        _id: "5a422ba71b54a676234d17fb", 
        title: "TDD harms architecture", 
        author: "Robert C. Martin", 
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", 
        likes: 0, 
        __v: 0 
    }, 
    { 
        _id: "5a422bc61b54a676234d17fc", 
        title: "Type wars", 
        author: "Robert C. Martin", 
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
        likes: 2, 
        __v: 0 
    }
]

const initialUsers = [
    {
        _id: "5f1dc5518912bb3bf9283aa0",
        username: "dleskosky",
        name: "Daniel Leskosky",
        passwordHash: "$2b$10$gwT8yfZikHv6gSijUIHWle8U4tN2743p2SlPJ4mEMqBI4psjk4Goq",
        __v: 3   
    },
    {
        _id: "5f1dc5f38912bb3bf9283aa1",
        username: "redDog14",
        name: "Sophie",
        passwordHash: "$2b$10$SpERJQLhczlXWIGkUW4gO.C33h7qpySQQZMBgSPiHjyMJ5/JFM.dK",
        __v: 6
    },
    {
        _id: "5f23260052455b66ab79eb5a",
        username: "testUser",
        name: "Test User",
        passwordHash: "$2b$10$NJQUHF1IvWzXU9BKEzFVQuc50WHKNdt8EDRjdY76r8jX2ptxEmbka",
        __v: 0
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs,
    initialUsers,
    blogsInDb,
    usersInDb
}