import { Router } from "express"
import { userLogin, userRegister } from "../controllers/auth.controller";
const authRouter = Router();


authRouter.post("/register", userRegister)

authRouter.post('/login', userLogin)

export default authRouter;