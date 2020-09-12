const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    url: String,
    likes: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userComments: [
      {
        //type: mongoose.Schema.Types.ObjectId,
        user: String,
        comment: String,
        commentId: String
      }
    ]
})

// could not get the backend id for user comments to work on the frontend

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      //returnedObject.userComments.id = returnedObject.userComments._id.toString()   could not get this to work
      //delete returnedObject.userComments._id                                        had to create id on frontend instead
      delete returnedObject.userComments._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Blog', blogSchema)