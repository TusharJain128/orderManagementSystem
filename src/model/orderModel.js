const mongoose  = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({
    customerId : {
        type:ObjectId,
        ref: "customerCollection",
        required: true,
        trim:true
    },

    productName:{
        type : String,
        require:true,
        trim:true,
        lowercase:true
    },
    price:{
        type:Number,
        require:true
    },
    discount:{
        type:Number,
        default:0
    }
},{timestamps:true})

module.exports = mongoose.model("orderCollection",orderSchema)