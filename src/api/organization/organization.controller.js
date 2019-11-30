import Joi from 'joi';

import { organization } from 'models';

// 그룹등록, 오늘보다 이전날짜에 못만남

export const Register = async (ctx) =>{
    const Request = Joi.object().keys({
        group_name: Joi.string().min(1).max(30).required(),
        autor : Joi.string().min(2).max(20).required(),
        location : Joi.string().required(),
        start_time : Joi.date().required(),
        finish_time : Joi.date().required(),
        dev_types : Joi.JSON().required(),
        user_count : Joi.integer().required()
    });

    const result = Joi.validate(ctx.request.body,Request);

    if(result.error){
        console.log("Register - JOI template error")
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }
    await organization.create({
        "group_name" : group_name,
        "author" : author,        
        "location" : location,
        "start_time" : start_time,
        "finish_time" : finish_time,
        "user_count" : user_count,
        "dev_types" : dev_types
    })
    
}