const data = require('./../data/users');
const http = require('./../shared/http');


const userController = {
    /**
     * Create user from Signup request
     * @param {object} req 
     * @param {object} res 
     */
    createUser: async (req, res) => {

        try {

            file_data = await data.insertUser(req.body);
            http.send(req, res, file_data);

        } catch(e) {

            console.log(`Error occured ${e}`)
            http.send(req, res, new Error('Error occured in user creation'))
        }
    }
}


module.exports = userController;