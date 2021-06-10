const router = require('express-promise-router');  
const controller = require('./../controller/users');

const userRouter = new router();

userRouter.post('/create_user', controller.createUser);
userRouter.post('/login', controller.login);

module.exports = userRouter;
