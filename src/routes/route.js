const express=require("express")
const router=express.Router()
const {createCustomer,loginCustomer}=require("../controller/customer")
const {authentication}=require("../middleware/auth")
const {createOrder}=require("../controller/order")

router.post("/createCustomer",createCustomer)
router.post("/customerLogin",loginCustomer)

router.post("/createOrder",authentication,createOrder)




module.exports=router