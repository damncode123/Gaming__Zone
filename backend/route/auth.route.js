import { Router } from "express";


import { Register, login ,Home} from "../controller/auth.controller.js";
// User routes
const AuthRoute = Router();
AuthRoute.post("/", Home); // this for knowing that backend is live or not.
AuthRoute.post("/register", Register);
AuthRoute.post("/login", login);

export default AuthRoute;
