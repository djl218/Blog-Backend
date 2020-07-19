const _ = require('lodash')

const dummy = (array) => {
    return 1
}

const totalLikes = (array) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return array.length === 0
        ? 0
        : array.reduce(reducer, 0)
}

const favoriteBlog = (array) => {
    const reducer = (max, item) => {
        return !max || item.likes > max.likes
            ? item
            : max
    }
    
    const { title, author, likes } = array.reduce(reducer, 0)
        return { title, author, likes }
}

const mostBlogs = (array) => {
    const topAuthorAndNumberOfBlogs =
        _.chain(array)
        .map('author')
        .flatten()
        .countBy()
        .entries()
        .maxBy(_.last)
        .value()

    const desiredFormat = {
        "author": topAuthorAndNumberOfBlogs[0],
        "blogs": topAuthorAndNumberOfBlogs[1]
    }

    return desiredFormat
}

const mostLikes = (array) => {
    const authorWithMostLikes = 
    _.chain(array)
    .groupBy('author')
    .map((objects, key) => ({
        'author': key,
        'likes': _.sumBy(objects, 'likes')
    }))
    .maxBy('likes')
    .value()

    return authorWithMostLikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}