const mongoose = require('mongoose')

const userShema = new mongoose.Schema({
    name:{type:String,required:true},
    country:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true}
})

const UserModel = mongoose.model('Users',userShema);

module.exports = UserModel