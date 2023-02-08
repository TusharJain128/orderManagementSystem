const orderModel=require("../model/orderModel")
const {orderJoi}=require("../validation/joivalidation")
const customerModel=require("../model/customerModel")
const nodemailer = require('nodemailer');

const createOrder=async (req,res)=>{
try {
            let data=req.body
            if (Object.keys(data).length == 0) {
                return res.status(400).send({ status: false, message: "Please Enter data in body" })
            }
    
            //joi validation
            let error
            const validation=await orderJoi.validateAsync(data).then(()=>true).catch((err)=>{error=err.message;return null})
            if(!validation) return res.status(400).send({  status: false,message: error})
    
            let findCustomer=await customerModel.findById(data.customerId)
            if(!findCustomer) return res.status(404).send({status:false,message:"no customer found with this id"})

            if(data.customerId != req.decode.customerId){
                return res.status(403).send({status:false, message: "You are not autherised"})
            }
    
            //cashback and discount
    
            let cashBack=findCustomer.cashBack
    
            if(findCustomer.status=="gold"){
                data.price=(data.price)-(data.price*(10/100))
                data.discount=10
                cashBack=cashBack+(data.price*(10/100))
            }
    
            if(findCustomer.status=="platinum"){
                data.price=(data.price)-(data.price*(20/100))
                data.discount=20
                cashBack=cashBack+(data.price*(20/100))
            }
            ///order creation
    
            const createOrder=await orderModel.create(data)
    
            //customer status
     
            let status="regular"
    
            if(findCustomer.orders>=10){
               status="gold"
            }
            if(findCustomer.orders>=20){
                
                status="platinum"
    
            }
    
            //update customer stautus and discount 
            const updateCustomer=await customerModel.findByIdAndUpdate(data.customerId,{$set:{status:status,cashBack:cashBack},$inc:{orders:1}})
    

            if(findCustomer.orders==9){
                
                let transport = nodemailer.createTransport(
                    {
                          service: 'gmail',
                          auth: { user: 'tiwaridivyamala99@gmail.com', pass: 'divyaGrv@12345678' }
                    }
              )
  
              let mailOptions = {
                    from: 'grvgoswami2007@gmail.com',
                    to: findCustomer.email,
                    subject: `"Hello"${findCustomer.name}`,
                    text: ` hii ${findCustomer.name} You have placed 9 orders with us. Buy one more stuff and you will be
                    promoted to Gold customer and enjoy 10% discounts!`
              }
  
              transport.sendMail(mailOptions, function (err, info) {
                    if (err) return console.log(err.message)
                    if (info) return consol.log('Email Sent' + info.response)
  
              })
            }
    
    
            return res.status(201).send({status:true,message:createOrder})
} catch (error) {
    return res.status(500).send({ status: false, message: error.message})
}
}

module.exports={createOrder}