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
    
    const reducedToMostLikedBlog = array.reduce(reducer, 0)

    const desiredFormat = new Object()
        desiredFormat.title = reducedToMostLikedBlog.title
        desiredFormat.author = reducedToMostLikedBlog.author
        desiredFormat.likes = reducedToMostLikedBlog.likes

    return desiredFormat
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}