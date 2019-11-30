import Router from "koa-router";

import auth from './auth';
import organization from './organization';
// import qna from './qna';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/organization', organization.routes());
// api.use('/qna', qna.routes());

export default api;
