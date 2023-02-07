const orderModel=require("../model/order")
const {orderJoi}=require("../validation/joivalidation")
const customerModel=require("../model/customer")
const nodemailer = require('nodemailer');

const createOrder=async (req,res)=>{
try {
            let data=req.body
            if (Object.keys(req.body).length == 0) {
                return res.status(400).send({ status: false, message: "Please Enter data in body" })
            }
    
            //joi validation
            let error
            const validation=await orderJoi.validateAsync(data).then(()=>true).catch((err)=>{error=err.message;return null})
            if(!validation) return res.status(400).send({  status: false,message: error})
    
            const findCustomer=await customerModel.findById(req.decode.customerId)
            if(!findCustomer) return res.status(404).send({status:false,message:"not customer found with this id"})
    
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
            const updateCustomer=await customerModel.findByIdAndUpdate(req.decode.customerId,{$set:{status:status,cashBack:cashBack},$inc:{orders:1}})
    
            //email functionality not working
            if(findCustomer.orders==9){
                
                        let mailTransporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: "vinti",
                                pass: "1234rtfjn"
                            }
                        });
                        
                        let mailDetails = {
                            from: "vintikumari04@gmail.com",
                            to: findCustomer.email, 
                            subject: 'Test mail',
                            text: `You have placed 9 orders with us. Buy one more stuff and you will be
                            promoted to Gold customer and enjoy 10% discounts!`
                        };
                        
                        mailTransporter.sendMail(mailDetails , function(err, data) {
                            if(err) {
                                console.log('Error Occurs');
                            } else {
                                console.log('Email sent successfully');
                            }
                        });
            }
    
    
            return res.status(201).send({status:true,message:createOrder})
} catch (error) {
    return res.status(500).send({ status: false, message: error.message})
}
}

module.exports={createOrder}