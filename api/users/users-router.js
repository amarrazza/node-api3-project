const express = require('express');
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware');
const { route } = require('../server');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const Users = require('./users-model');
const Posts = require('../posts/posts-model');
const router = express.Router();

router.get('/', async (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try{
    let users = await Users.get();
    res.status(200).json(users);
  } catch{
    res.status(500).json({
      message: 'Error retrieving users'
    })
  }
  

});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user);
});

router.post('/', validateUser, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  let newUser = req.body;
  try {
    let result = await Users.insert(newUser);
    res.status(201).json(result);
    // res.status(201).json(result)
  }
  catch(err) {
    next(err);
  }

});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  let { id } = req.params;
  Users.update(id, req.body)
    .then(updatedUser => {
      res.json(updatedUser)
    }).catch(next)
});

router.delete('/:id', validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  let { id } = req.params;
  Users.remove(id)
    .then(resp => {
      console.log(resp);
      res.json({
        message: 'Successfully deleted'
      })
    }
    ).catch(next);
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  let { id } = req.params;

  // try{
  //   const result = await Users.getUserPosts(id)
  //   res.json(result)
  // }catch(err){
  //   next(err);
  // }

  Users.getUserPosts(id)
    .then(resp => {
      res.json(resp)
    })
    .catch(next);
});

router.post('/:id/posts', validateUserId, validatePost, async(req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  let { id } = req.params;
  try {
    const result = await Posts.insert({
      user_id: id,
      text: req.body.text
    })
    res.status(201).json(result);
  }catch(err) {
    next(err);
  }
});

router.use((err, req, res, next) => { //eslint-disable-line
  res.status(err.status || 500).json({
    customMessage: 'something bad happened',
    message: err.message,
    stack: err.stack
  })
})

// do not forget to export the router
module.exports = router;
