import mongoose from "mongoose";


const userSchema =mongoose.Schema({

    email: {
        type : String,
        required : true,
        unique : true,
        match : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 
    },
    firstName : {
        type : String,
        required : true
    },
    lastName :{
        type : String,
        required : true
    },
    password: {
        type : String,
        required : true
    },
    isBlocked :{
        type : Boolean,
        default : false
    },
    type : {
        type : String,
        enum : ['admin', 'customer'],
        default : 'customer'
    },
    profilePicture: {
        type : String,
        default : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    }

})

const User = mongoose.model("User", userSchema);

export default User;
