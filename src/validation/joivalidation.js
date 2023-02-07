const Joi=require("joi")
const customerJoi=Joi.object({
    name:Joi.string().trim().required(),

    phone:Joi.string().trim().required(),
    email:Joi.string().trim().required().regex(/^[A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1,}[A-Za-z.]{2,8}$/).
    message("please enter valid email"),
    password:Joi.string().trim().required().min(8).max(15),
    status:Joi.string().optional(),
    orders:Joi.number().optional(),
    cashBack:Joi.number().strict().optional()
})

const loginJoi=Joi.object({
    email:Joi.string().trim().required().regex(/^[A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1,}[A-Za-z.]{2,8}$/).
    message("please enter valid email"),
    password:Joi.string().trim().required().min(8).max(15)
})


const orderJoi=Joi.object({
    title : Joi.string().trim().required(),
    description:Joi.string().trim().required(),
    price:Joi.number().required(),
    discount:Joi.number().strict().optional()
})
module.exports={customerJoi,orderJoi,loginJoi}
