const data = require('./../data/users');
const http = require('./../shared/http');
const fs = require('fs');
const formidable = require('formidable');

const userController = {
    /**
     * Create user from Signup request
     * @param {object} req 
     * @param {object} res 
     */
    createUser: async (req, res) => {       

        try {

            let form = new formidable.IncomingForm();

            form.parse(req, async (err, fields, files) => {
                fields.image = fs.readFileSync(files.file.path)
                fields.imageType = files.file.type;
    
                let result = await data.insertUser(fields);
                http.send(req, res, result);
            });            

        } catch(e) {

            console.log(`Error occured ${e}`)
            http.send(req, res, {error: "insert_error", message: `Error occured in user creation`, err_stack: e});
        }
    },

    /**
     * To validate logging user name and password
     * @param {JSON} req 
     * @param {JSON} res 
     */
    login: async (req, res) => {

        try {

            let result = await data.signIn(req.body);
            http.send(req, res, result);

        } catch (e) {

            console.log(`Error occured ${e}`)
            http.send(req, res, {error: "login_error", message: `Error occured in user login`, err_stack: e})
        }
       
    },

    /**
     * Once logged in slect user Info
     * @param {JSON} req 
     * @param {JSON} res 
     */
    getUserInfo: async(req, res) => {

        try {

            let result = await data.getUserInfo(req.query);
            http.send(req, res, result);

        } catch (e) {

            console.log(`Error occured ${e}`)
            http.send(req, res, {error: "user_select", message: `Error occured in user select`, err_stack: e})
        }
    }
}


module.exports = userController;