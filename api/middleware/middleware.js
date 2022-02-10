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
      res.status(404).json({  message: 'user not found'});
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
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { name } = req.body;
  if(!name){
    res.status(400).json({
      message: 'missing required name field'
    })
  } else {
    next()
  }
  console.log('validateUser middleware');
  
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { text } = req.body;
  if(!text){
    res.status(400).json({
      message: "missing required text field"
    })
  } else {
    next()
  }
  console.log('validatePost middleware');
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validatePost,
  validateUser,
  validateUserId
}