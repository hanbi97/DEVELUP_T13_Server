import Router from "koa-router";
import {
  Register
} from "./organization.controller";

const organization = new Router();

organization.post("/organizationRegister", Register);

export default organization;
