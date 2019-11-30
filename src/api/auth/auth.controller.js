/*Register, checkEmailValidate, Login, checkUserValidate, checkUser, checkUserId
UpdateUserInfo, ConfirmEmail, SendChangePW, checkPassword, FollowList*/
import Joi from 'joi';
import crypto from 'crypto'; //암호화 관련 모듈, Cipher:일반적인 암호화(key를 이용해 암호화,복호화) Hmac: 되돌릴 수 없게 암호화, 암호화 된 것 자체를 이용

import { user } from '../../models';
import { generateToken, decodeToken } from 'lib/token.js';
import { sendRegisterEmail, sendPasswordChange } from 'lib/sendEmail.js';

import dotenv from 'dotenv';
dotenv.config();

export const Register = async (ctx) =>{
    //essential register info
    const Request = Joi.object().keys({
        password : Joi.string().min(8).max(30).required(),
        name : Joi.string().min(2).max(20).required(),
        email : Joi.string().email().required()
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
    //id duplication check
    //return 0: no duplicate id
    const exist = await user.findOne({
        where: {
            email : ctx.request.body.email
        }
    });

    if(exist != null){
        console.log(`Register - ${ctx.request.body.email}는 이미 존재하는 아이디(이메일)입니다.`);
        ctx.status = 400;
        ctx.body ={
            "error" : "002"
        }
        return;
    }

    //save name in DB
    const name = ctx.request.body.email;

    //encoding password
    const password = crypto.createHmac('sha256',process.env.Password_KEY).update(ctx.request.body.password).digest('hex');

    //making email auth key
    let verifycode;
    let key_for_verify;
    do{
        let key_one=crypto.randomBytes(256).toString('hex').substr(100,5);
        let key_two=crypto.randomBytes(256).toString('base64').substr(50,5);
        key_for_verify = key_one+key_two;

        verifycode = await user.findAll({
            where : {
                "key_for_verify" : key_for_verify
            }
        });
    }while(verifycode.length);

    await user.create({
        "password" : password,
        "name" : ctx.request.body.name,
        "email" : ctx.request.body.email,
        "key_for_verify" : key_for_verify
    });

    //send email to email verification
    sendRegisterEmail(ctx.request.body.email, key_for_verify);

    console.log(`새로운 ${name} 회원이 저장되었습니다.`);

    ctx.status = 200;
    ctx.body = {
        "name" : ctx.request.body.name
    };
}

export const Login = async (ctx) =>{
    const Request = Joi.object().keys({
        email : Joi.string().email().min(5).max(50).required(),
        password : Joi.string().min(5).max(50).required
    });

    console.log(ctx.request.body);

    const Result= Joi.validate(ctx.request.body,Request);

    if(Result.error){
        console.log('Login - Join 형식 에러');
        ctx.status=400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    //checking id in db
    const founded = await user.findOne({
        where: {
            email : ctx.request.body.email
        }
    });

    if(founded==null){
        console.log(`${ctx.request.body.id}: 존재하지 않는 계정`);
        ctx.status = 400;
        ctx.body ={
            "error" : "003"
        }
        return;
    }

    const input = crypto.createHmac('sha256',process.env.Password_KEY).update(ctx.request.body.password).digest('hex');

    if(founded.password != input){
        console.log('Login - 비번 틀렸음');
        ctx.status = 400;
        ctx.body ={
            "error" : "004"
        }
        return;
    }

    const payload = {
        user_id : founded.user_id
    };

    let token =null;
    token = await generateToken(payload);

    console.log(`${founded.user_id} 로그인 성공`);
    ctx.status = 200;
    ctx.body={
        "token" : token
    };
}

//Did user check email?
export const CheckUserValidate = async (ctx) =>{
    const token = ctx.header.token;
    const decoded = await decodeToken(token);

    console.log(`checkuservalidate - 접속 유저 키는 ${decoded.user_id}`);

    const founded = await user.findOne({
        where : {
            "user_id" : decoded.user_id
        }
    });

    ctx.status=200;
    ctx.body={
        "validation" : founded.validation
    }
}

//return userinfo (with token)
export const CheckUserInfo = async (ctx) =>{
    const token = ctx.header.token;
    const decoded = await decodeToken(token);

    console.log(`checkuservalidate - 접속 유저 키는 ${decoded.user_id}`);

    const founded = await user.findOne({
        where : {
            "user_id" : decoded.user_id
        }
    });

    ctx.status=200;
    ctx.body={
        "name" : founded.name,
        "thumbnail" : founded.thumbnail,
        "user_id" : decoded.user_id,
        "email" : founded.email,
        "introduce" : founded.introduce,
        "skill_types" : founded.skill_types
    }
};

//return userEmail(id) (without token)
export const CheckUserId = async (ctx) =>{
    const founded = await user.findOne({
        where : {
            "user_id" : decoded.user_id
        }
    });

    ctx.status=200;
    ctx.body={
        "name" : founded.name,
        "thumbnail" : founded.thumbnail,
        "user_id" : decoded.user_id,
        "email" : founded.email,
        "introduce" : founded.introduce,
        "skill_types" : founded.skill_types
    }
};

export const UpdateUserInfo = async (ctx) =>{
    const Request = Joi.object().keys({
        password : Joi.string().min(8).max(30).required(),
        name : Joi.string().min(2).max(20).required(),
        email : Joi.string().email().min(5).max(50).required(),
        introduce : Joi.string().required()
    });

    console.log(ctx.request.body);

    const token = ctx.header.token;

    const decoded = await decodeToken(token);
    
    const founded = await user.findOne({
        where : {
            "user_id" : decoded.user_id
        }
    });

    await founded.update({
        "name" : ctx.request.body.name,
        "email" : ctx.request.body.email,
        "password" : ctx.request.body.password,
        "introduce" : ctx.request.body.introduce,
        "skill_types" : ctx.request.body.skill_types
    });

    console.log(`${decoded.user_id}의 회원정보를 수정하였습니다.`);

    ctx.status = 200;
    ctx.body = {
        "user_id" : decoded.user_id
    };
};


//verify email address
export const ConfirmEmail = async (ctx) =>{
    const key_for_verify = ctx.query.key;

    const account = await user.findOne({
        where : {
            "key_for_verify" : true
        }
    });

    await account.update({
        "validation" : true
    });

    console.log(`user${account.user_id}의 이메일 인증 완료`);

    ctx.status = 200;
    ctx.body ={
        "user_id" : account.user_id
    }
}

//if user change PW, send email
export const SendChangePW = async (ctx) =>{
    const Request = Joi.object().keys({
        email : Joi.string().email().min(5).max(50).required()
    });

    const Result = Joi.validate(ctx.request.body,Request);

    if(Result.error) {
        console.log(`Login - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    const founded = await user.findOne({
        where : {
            email : ctx.request.body.email
        }
    });
    
    if(founded==null){
        console.log(`${ctx.request.body.email}은 존재하지 않는 계정임`);
        ctx.status=400;
        ctx.body={
            "error" : "003"
        }
        return;
    }

    sendPasswordChange(founded.email);

    ctx.status=200;
    ctx.body={
        "user_id" : founded.user_id
    };
}

//check Password
export const CheckPassword = async (ctx) =>{
    const Request = Joi.object().keys({
        password : Joi.string().min(5).max(50).required()
    });

    const Result = Joi.validate(ctx.request.body,Request);

    if(Result.error) {
        console.log(`CheckPassword - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }
    
    const token = ctx.header.token;

    const decoded = await decodeToken(token);

    console.log(`DeleteUser - 접속한 유저 키 : ${decoded.user_id}`);

    const founded = await user.findOne({
        where : {
            "user_id" : decoded.user_id
        }
    });

    const input = crypto.createHmac('sha256',process.env.Password_KEY).update(ctx.request.body.password).digest('hex');
   
    let is_correct = true;
    if(founded.password!= input){
        is_correct = false;
    }

    ctx.status=200;
    ctx.body={
        "is_correct" : is_correct
    };
}

export const FollowList = async (ctx) =>{
    const founded = await user.findAll();
    ctx.body = founded;
}