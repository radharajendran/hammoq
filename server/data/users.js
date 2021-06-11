const mongoose = require('mongoose');
const db = require('./db')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const config = require('./../cfg/config.json');
const schema = mongoose.Schema;

// create an schema for users collections
let userSchema = schema({
            firstName:  {
                type: String,
                required: true
            },
            lastName: String,
            phone: Number,
            birthDate: {
                required: true,
                type: String
            },            
            email: {
                required: true,
                type: String
            },
            password: {
                required: true,
                type: String
            },
            image: {
                required: true,
                type: Buffer
            },
            imageType: {
                type: String,
                required: true
            }         
});

const dataLayer = {

    /**
     * Create user from signup screen
     * @param {JSON} data 
     * @returns {JSON} error, result
     */
    insertUser: async (data) => {

        try {
            let userDoc = mongoose.model('users', userSchema);

            //Check User availability based on email
            let userExist = await userDoc.exists({ email: data.email });

            if(userExist) {
                return {error: "conflict", message: "User Already Exists"};
            }
            
            data.password = bcrypt.hashSync(data.password, 8);

            userDoc = new userDoc(data);
            return await userDoc.save(); 
        }
        catch(e) {
            console.log(`Error occured in insert ${e}`);
            return new Error(e);
        }
    },
    
    /***
     * Validate users when sign in
     * @param {JSON} data
     */
    signIn: async (data) => {

        try {
            let user = mongoose.model('users', userSchema);

            let userData = await user.findOne({"email": data.username });
    
            if(!userData) {
                return {error: "invalid_user", message: "User not available. Please register"}
            }
    
            let passwordIsValid = bcrypt.compareSync(
                data.password,
                userData.get('password')
            );
    
            if(!passwordIsValid) {
                return {error: "invalid_user", message: "Invalid User/Password"}
            }
            
            userData = userData.toJSON();
            userData.imageBase64 = new Buffer(userData.image.data).toString();
            userData.token = dataLayer.generateJwtToken(userData.email);

            return userData;

        }
        catch (e) {
            console.log(`Error occured in Login ${e}`);
            return new Error(e);
        }    

    },

    /**
     * Update user Info based on id
     * @param {JSON} data 
     * @returns 
     */
     updateUserInfo: async (data) => {
        let userDoc = mongoose.model('users', userSchema);

        try {

            return await userDoc.findOneAndUpdate({
                'id': data.id
            }, {
                firstName: data.firstName,
                lastName: data.lastName,
                birthDate: data.birthDate,
                email: data.email,
                phone: data.phone
            });          
        
        }
        catch (e) {
            console.log(`Error occured in update ${e}`);
            return new Error(e);
        }   
    },

    /**
     * Update user Info based on id
     * @param {JSON} data 
     * @returns 
     */
     updateUserPassword: async (data) => {
        let userDoc = mongoose.model('users', userSchema);

        try {

            let userData = await userDoc.findById(data.id);

            let passwordIsValid = bcrypt.compareSync(
                data.oldPassword,
                userData.get('password')
            );
    
            if(!passwordIsValid) {
                return {error: "invalid_old_pwd", message: "Invalid Old Password"}
            }

            let encryptPassword = bcrypt.hashSync(data.newPassword, 8);

            return await userDoc.findByIdAndUpdate(data.id, {
                password: encryptPassword
            });          
        
        }
        catch (e) {
            console.log(`Error occured in update ${e}`);
            return {error: "user_pwd_update", message: `Error occured in user password update`, err_stack: e}
        }   
    },

    /**
     * 
     */
    getUserById: async(data) => {

        try {
            let userDoc = mongoose.model('users', userSchema);
            let userData = await userDoc.findById(data.id)
            userData = userData.toJSON();
            userData.imageBase64 = userData.image.data;
            return userData;
        }
        catch (e) {
            console.log(`Error occured in get user ${e}`);
            return {error: "user_select", message: `Error occured in user select`, err_stack: e}
        }
     
    },

    /**
     * Generate Jwt token from username and signed key
     * @param {Sting} username 
     * @returns token
     */
    generateJwtToken: async (username) => {
        return await jwt.sign({ username: username }, config.SECRET_KEY,
            {
                expiresIn: '24h'
            });
        
    },

    /**
     * delete fields 
     */
    deleteFields: async (data) => {
        try {
            let userDoc = mongoose.model('users', userSchema);

            return await userDoc.findOneAndUpdate({
                'id': data.id
            }, {
                [data.field]: null
            });      
        }
        catch (e) {
            console.log(`Error occured in get user ${e}`);
            return {error: "user_select", message: `Error occured in user select`, err_stack: e}
        }

    }

}


module.exports = dataLayer    
