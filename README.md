# Blog-Backend
Backend for the blog list app.

Link to the blog list app:<br>
https://warm-crag-63925.herokuapp.com/

The frontend can be found here:<br>
https://github.com/djl218/bloglist-frontend

This project builds upon the same concepts that I used when building the Phonebook App, but introduces more complexity.

The React frontend uses Redux for State Management. It has five reducers which are then combined and put in store. The frontend also uses React Router to create a dynamically-rendering Single Page Application. There is also unit testing that is done with Jest. End-to-end testing was performed with Cypress. The styling is done using styled-components.

The Node.js backend stores the data in a MongoDB Collection and Mongoose is used to model that data. Integration testing was performed with SuperTest and Lodash. Additional end-to-end testing was done with Cypress.

Some notable features of the application are:
  *  login/logout functionality
  *  new account creation
  *  new posts display the user that added them
  *  posts can only be deleted by user that added them
  *  users can comment on posts