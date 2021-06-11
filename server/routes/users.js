const router = require('express-promise-router');  
const controller = require('./../controller/users');

const userRouter = new router();

userRouter.post('/create_user', controller.createUser);
userRouter.post('/login', controller.login);
userRouter.put('/update_user_info', controller.updateUserInfo);
userRouter.put('/reset_password', controller.updateUserPassword);
userRouter.get('/user_info/:id', controller.getUserById);
userRouter.delete('/delete_user_info', controller.deleteFields);

module.exports = userRouter;
