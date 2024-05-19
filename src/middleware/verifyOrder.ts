import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'


const detailSchema = Joi.object({
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(1).optional(),
    product_id: Joi.number().min(1).optional()
})
/** create schema when add new pack's data, all of fileds have to be required */
const addDataSchema = Joi.object({
    cust_id: Joi.string().required(),
    order_date: Joi.string().required(),
    order_detail: Joi.array().items(detailSchema).min(1).required()
})


/** create schema when edit pack's data, all of fileds allow and optional to sent in request */
const updateDataSchema = Joi.object({
    cust_id: Joi.string().optional(),
    order_date: Joi.string().optional(),
    order_detail: Joi.array().items(detailSchema).min(1).optional()

})


export const verifyAddOrder = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = addDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyEditOrder = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = updateDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}