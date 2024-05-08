import { Router } from "express";


import { Register, login } from "../controller/auth.controller.js";
// User routes
const AuthRoute = Router();
AuthRoute.post("/register", Register);
AuthRoute.post("/login", login);

export default AuthRoute;
