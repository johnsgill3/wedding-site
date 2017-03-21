var Joi = require('joi')

var createOrder = Joi.object().keys({
    currency: Joi.string().default('usd'),
    metadata: Joi.any(),
    items: Joi.array().items(Joi.object().keys({
        type: Joi.string().default('sku'),
        parent: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
    })),
    // shipping: Joi.object().keys({
    //     name: Joi.string().required(),
    //     address: Joi.object().keys({
    //         city: Joi.string().required(),
    //         country: Joi.string().required(),
    //         line1: Joi.string().required(),
    //         state: Joi.string().required(),
    //         postal_code: Joi.string().required(),
    //     }).required(),
    // }).required(),
})

createOrder.isValid = function(obj) {
    return !createOrder.validate(obj).error
}

var payOrder = Joi.object().keys({
    orderID: Joi.string().required(),
    token: Joi.string().required(),
    email: Joi.string().required()
})

payOrder.isValid = function(obj) {
    return !payOrder.validate(obj).error
}

var cancelOrder = Joi.object().keys({
    orderID: Joi.string().required()
})

cancelOrder.isValid = function(obj) {
    return !cancelOrder.validate(obj).error
}

var stripe = Joi.object().keys({
    allowRememberMe: Joi.boolean().default(false),
    amount: Joi.number().integer().positive().required(),
    billingAddress: Joi.boolean().default(true),
    currency: Joi.string().default('usd'),
    image: Joi.string(),
    panelLabel: Joi.string(),
    zipCode: Joi.boolean().default(true),
})

stripe.isValid = function(obj) {
    return !stripe.validate(obj).error
}

var products =  Joi.object().pattern(/.*/,
    Joi.object().keys({
        price : Joi.number().integer().positive().required(),
        name : Joi.string().required(),
        description : Joi.string().required(),
        images : Joi.array().items(Joi.string()),
        quantity : Joi.number().integer().min(0).required()
    }).required()
)

products.isValid = function(obj) {
    return !products.validate(obj).error
}

module.exports = {
    createOrder: createOrder,
    payOrder: payOrder,
    cancelOrder: cancelOrder,
    stripe: stripe,
    products : products
}
