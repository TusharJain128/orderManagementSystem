const customerModel=require("../model/customerModel")
const {customerJoi,loginJoi}=require("../validation/joivalidation")
const jwt=require("jsonwebtoken")

//=====================create========================================
const createCustomer=async (req,res)=>{
try {
        let data=req.body
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please Enter data in body" })
        }
        //joi validation
        let error
        const validation=await customerJoi.validateAsync(data).then(()=>true).catch((err)=>{error=err.message;return null})
        if(!validation) return res.status(400).send({  status: false,message: error})
    
        const findUser = await customerModel.findOne({$or:[{email:data.email},{phone:data.phone}]})

        if(findUser){
    	    if(findUser.email==data.email.trim()) {return res.status(400).send({status:false,message:"email already exist"})}
    	    if(findUser.phone==data.phone.trim()) {return res.status(400).send({status:false,message:"phone already exist"})}
    	  }
    
    
        const createData=await customerModel.create(data)
    
        return res.status(201).send({status:false,message:createData})
} catch (error) {
    return res.status(500).send({ status: false, message: error.message})
}
}

//////===================================login====================================
const loginCustomer=async (req,res)=>{
try {
        let data=req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please Enter data in body" })
        }
        
        let error
        const validation=await loginJoi.validateAsync(data).then(()=>true).catch((err)=>{error=err.message;return null})
        if(!validation) return res.status(400).send({  status: false,message: error})
    
        let { email , password } = data
        const findUser = await customerModel.findOne({ email:email,password:password })
    
        if (!findUser) {
            return res.status(404).send({ status: false, message: `User not found for this email: ${email}` })
        }

        const token = jwt.sign( {customerId: findUser._id.toString()},"dangerous-secret-key",{ expiresIn: "30h" })
        return res.status(200).send({ status: true, message: "User login successfull", data: { userId: findUser._id, token } })

} catch (error) {
    return res.status(500).send({ status: false, message: error.message})
}


}

module.exports={createCustomer,loginCustomer}