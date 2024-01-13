const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type:String,
        trim: true,
        required: true
    },
    email: {
        type:String,
        trim: true,
        required: true
    },
    pruducts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    ]
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User',userSchema)

module.exports = User;