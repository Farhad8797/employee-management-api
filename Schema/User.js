const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    username_lookup: { 
        type: String, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    user_role: {
        type: String,
        required: true,
        enum: ["user","admin","editor"],
        default: "user"
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    refreshToken: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});

UserSchema.pre('save' , async function(){
    if(this.isModified('username')){
        this.username_lookup = this.username.replace(/\s+/g,'').toLowerCase();
    }
});

module.exports = mongoose.model("User",UserSchema);