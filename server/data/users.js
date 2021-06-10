const mongoose = require('mongoose');
const db = require('./db')
var bcrypt = require("bcryptjs");
const { pass } = require('./db');
const { getUserInfo } = require('../controller/users');

// create an schema for users collections
let userSchema = new mongoose.Schema({
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

const data = {

    /**
     * Create user from signup screen
     * @param {JSON} data 
     * @returns {JSON} error, result
     */
    insertUser: async (data) => {
        let userDoc = mongoose.model('users', userSchema);

        try {

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

            return userData;

        }
        catch (e) {
            console.log(`Error occured in Login ${e}`);
            return new Error(e);
        }    

    },

    /**
     * Select user Info based on id
     * @param {JSON} data 
     * @returns 
     */
     getUserInfo: async (data) => {
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

        return userData;
    }

}


module.exports = data    
