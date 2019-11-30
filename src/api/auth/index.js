import Router from 'koa-router';
import {Register, Login, CheckUserValidate, CheckUserInfo, CheckUserId, UpdateUserInfo, ConfirmEmail, SendChangePW, CheckPassword, FollowList} from './auth.controller';

const auth = new Router();

auth.get('/checkUserValidation',CheckUserValidate);
auth.get('/checkUserInfo',CheckUserInfo);
auth.get('/followList',FollowList);
auth.get('/confirmEmail',ConfirmEmail);

auth.post('/register',Register);
auth.post('/login',Login);
auth.post('/sendChangePW',SendChangePW);
auth.post('/checkPW',CheckPassword);
auth.post('/checkUserID',CheckUserId);

export default auth;