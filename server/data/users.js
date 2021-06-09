const mongoose = require('mongoose');
const db = require('./db')

// create an schema for users collections
let userSchema = new mongoose.Schema({
            firstNname:  String,
            lastName: String,
            phone: String,
            birthDate: String,            
            email: String            
});

const data = {
    insertUser: async (data) => {
        let userDoc = mongoose.model('users', userSchema);

        try {
            userDoc = new userDoc(data);
            return await userDoc.save(); 
        }
        catch(e) {
            console.log(`Error occured in insert ${e}`);
            return new Error(e);
        }
    }
}


module.exports = data    
