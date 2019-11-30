import Joi from 'joi';

import { user } from 'models';
import { organization } from 'models';

import dotenv from 'dotenv';
dotenv.config();

export const Register = async (ctx) =>{
    const Request = Joi.object().keys({
        group_name: Joi.string().min(1).max(30).required(),
        autor : Joi.string().min(2).max(20).required(),
        location : Joi.string().required(),
        start_time : Joi.string().required(),
        finish_time : Joi.string().required(),
        dev_types : Joi.string().required(),
        user_count : Joi.number().required()
    });

    const result = Joi.validate(ctx.request.body,Request);

    if(!result.error){
        console.log("Register - JOI template error")
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }


    await organization.create({
        "group_name" : ctx.request.body.group_name,
        "author" : ctx.request.body.author,        
        "location" : ctx.request.body.location,
        "start_time" : ctx.request.body.start_time,
        "finish_time" : ctx.request.body.finish_time,
        "user_count" : ctx.request.body.user_count,
        "dev_types" : ctx.request.body.dev_types
    });

    console.log('새로운 모임 정보가 등록되었습니다.');

    ctx.status =200;
    ctx.body ={
        "group_name" : ctx.request.body.group_name
    };
    
}