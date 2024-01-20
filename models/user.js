const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        required: [true, "username is required"],
        unique: true
    },
    email:{
        type:String,
        required: [true, "email is requried"],
        unique: true,
        validate: [isEmail, "invalid email"]
    },
    password:{
        type:String,
        required:[true, "password is required"],
        minlength:[8, "min length must be 8 chars"]
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.login = async function(emailname, password){
    const user = await this.findOne({
        $or:[
            {
                username: emailname
            },
            {
                email: emailname
            }
        ]
    });

    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect username or email');
}

module.exports = mongoose.model('user', userSchema);