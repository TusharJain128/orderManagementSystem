const mongoose  = require("mongoose");

const customerSchema = new mongoose.Schema({
    name:{
        type : String,
        require:true,
        trim:true
    },

    phone:{
        type:String,
        unique:true,
        require:true,
        trim:true
    },
    email:{
        type : String,
        require:true,
        unique:true,
        trim:true
    },
    password:{
        type : String,
        require:true,
        trim:true
    },

    status:{
        type:String,
        enum: ["regular","gold","platinum"],
        default:"regular"
    },
    orders:{
        type : Number,
        default:0
    },
    cashBack:{
        type:Number,
        default:0
    }
  
},{timestamps:true})


module.exports = mongoose.model("customerCollection", customerSchema)