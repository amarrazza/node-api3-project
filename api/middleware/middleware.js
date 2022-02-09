const Users = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  const timestamp = new Date().toLocaleString()
  const method = req.method
  const url = req.originalUrl
  console.log(`[${timestamp}] method: ${method} to ${url}`);
  next()
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  let { id } = req.params
  // let result = await Users.getById(id);
  // if(result == null){
  //   res.status(404).json({  message: 'This user could not be found'});
  // } else {
  //   req.user = result
  // }

  try {
    const user = await Users.getById(id);
    if(!user){
      res.status(404).json({  message: 'This user could not be found'});
    } else {
      req.user = user;
      next()
    } 
  }catch(err) {
    res.status(500).json({
      message: 'Problem finding user'
    })
  }

  console.log('validateUserId middleware');
  next()
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  console.log('validateUser middleware');
  next()
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  console.log('validatePost middleware');
  next()
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validatePost,
  validateUser,
  validateUserId
}