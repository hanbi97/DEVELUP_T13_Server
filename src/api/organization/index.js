import Router from "koa-router";
import {
  Register,
  newLoad,
  sortLoad,
  Click
} from "./organization.controller";

const organization = new Router();

organization.get("/newLoad",newLoad);
organization.get("/sortLoad",sortLoad);

organization.post("/register", Register);
organization.post("/click",Click);

export default organization;
